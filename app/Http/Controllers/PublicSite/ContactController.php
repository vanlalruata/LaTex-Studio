<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Http\Requests\PublicSite\StoreContactEnquiryRequest;
use App\Mail\ContactNotificationMail;
use App\Models\ContactEnquiry;
use App\Services\PublicSite\PublicSiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Public/Contact');
    }

    public function store(
        StoreContactEnquiryRequest $request,
        PublicSiteSettings $settings,
    ): RedirectResponse {
        if (! (bool) $settings->get('contact_form_enabled', true)) {
            abort(403, 'The contact form is currently disabled.');
        }

        // Honeypot field: silently return success without storing or notifying
        if ($request->filled('website')) {
            return back()->with('success', 'Thank you. Your enquiry has been received.');
        }

        $validated = $request->validated();

        $enquiry = ContactEnquiry::query()->create([
            'name' => trim((string) $validated['name']),
            'email' => strtolower(trim((string) $validated['email'])),
            'organization' => isset($validated['organization']) ? trim((string) $validated['organization']) : null,
            'role' => isset($validated['role']) ? trim((string) $validated['role']) : null,
            'category' => (string) $validated['category'],
            'subject' => trim((string) $validated['subject']),
            'message' => trim((string) $validated['message']),
            'status' => 'new',
            'source_page' => isset($validated['source_page']) ? (string) $validated['source_page'] : 'contact',
        ]);

        $destination = $settings->get('contact_notification_email');
        if (is_string($destination) && $destination !== '' && filter_var($destination, FILTER_VALIDATE_EMAIL) !== false) {
            Mail::to($destination)->queue(new ContactNotificationMail($enquiry));
        }

        return back()->with('success', 'Thank you. Your enquiry has been recorded and our team will review it.');
    }
}
