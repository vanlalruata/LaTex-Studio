<?php

use App\Mail\ContactNotificationMail;
use App\Models\ContactEnquiry;
use App\Models\User;
use App\Services\PublicSite\PublicSiteSettings;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

test('contact page renders cleanly', function () {
    $this->get(route('public.contact'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Public/Contact'));
});

test('contact enquiry validates required fields and rejects invalid category', function () {
    $this->post(route('public.contact.store'), [
        'name' => '',
        'email' => 'not-an-email',
        'category' => 'invalid_category',
        'subject' => '',
        'message' => 'short',
    ])->assertSessionHasErrors(['name', 'email', 'category', 'subject', 'message']);

    expect(ContactEnquiry::query()->count())->toBe(0);
});

test('contact enquiry persists without mailing when notification email is unconfigured', function () {
    Mail::fake();

    $this->post(route('public.contact.store'), [
        'name' => 'Dr. Alice',
        'email' => 'alice@university.edu',
        'organization' => 'Department of Physics',
        'role' => 'Associate Professor',
        'category' => 'institutional_deployment',
        'subject' => 'Lab workspace enquiry',
        'message' => 'We would like to evaluate LaTeX Studio for our graduate lab.',
    ])->assertRedirect();

    $enquiry = ContactEnquiry::query()->first();
    expect($enquiry)->not->toBeNull();
    expect($enquiry?->email)->toBe('alice@university.edu');
    expect($enquiry?->status)->toBe('new');

    Mail::assertNothingQueued();
});

test('contact enquiry queues notification mail when notification email is configured', function () {
    Mail::fake();

    app(PublicSiteSettings::class)->updateMany([
        'contact_notification_email' => 'inbox@latexstudio.com',
    ]);

    $this->post(route('public.contact.store'), [
        'name' => 'Bob Researcher',
        'email' => 'bob@example.com',
        'category' => 'product_enquiry',
        'subject' => 'Question about XeLaTeX',
        'message' => 'Does the sandboxed TeX Live worker support fontspec?',
    ])->assertRedirect();

    Mail::assertQueued(ContactNotificationMail::class, function (ContactNotificationMail $mail) {
        return $mail->hasTo('inbox@latexstudio.com');
    });
});

test('honeypot field discards spam submissions silently', function () {
    Mail::fake();

    $this->post(route('public.contact.store'), [
        'name' => 'Bot',
        'email' => 'bot@spam.example',
        'category' => 'general',
        'subject' => 'Spam subject',
        'message' => 'This is an automated spam message with enough length.',
        'website' => 'https://spam.example',
    ])->assertRedirect();

    expect(ContactEnquiry::query()->count())->toBe(0);
    Mail::assertNothingQueued();
});

test('contact endpoint enforces rate limiting', function () {
    for ($i = 0; $i < 5; $i++) {
        $this->post(route('public.contact.store'), [
            'name' => 'User '.$i,
            'email' => "user{$i}@example.com",
            'category' => 'general',
            'subject' => 'Subject '.$i,
            'message' => 'Valid enquiry message number '.$i,
        ])->assertRedirect();
    }

    $this->post(route('public.contact.store'), [
        'name' => 'User 6',
        'email' => 'user6@example.com',
        'category' => 'general',
        'subject' => 'Subject 6',
        'message' => 'Valid enquiry message number 6',
    ])->assertStatus(429);
});

test('admin can view and update enquiry status while non-admin is forbidden', function () {
    $enquiry = ContactEnquiry::query()->create([
        'name' => 'Researcher',
        'email' => 'researcher@example.com',
        'category' => 'general',
        'subject' => 'Help',
        'message' => 'Need help with a bibliography.',
        'status' => 'new',
    ]);

    $user = User::factory()->create();
    $this->actingAs($user)
        ->get(route('admin.public-site.enquiries.index'))
        ->assertForbidden();

    $role = Role::query()->firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin = User::factory()->create();
    $admin->assignRole($role);

    $this->actingAs($admin)
        ->get(route('admin.public-site.enquiries.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Enquiries')
            ->has('enquiries', 1)
        );

    $this->actingAs($admin)
        ->patch(route('admin.public-site.enquiries.update', $enquiry), [
            'status' => 'resolved',
        ])
        ->assertRedirect();

    expect($enquiry->fresh()?->status)->toBe('resolved');
});
