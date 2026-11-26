<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactEnquiryRequest;
use App\Models\ContactEnquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactEnquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $query = ContactEnquiry::query()->latest();

        if (is_string($status) && in_array($status, ['new', 'in_progress', 'resolved', 'spam'], true)) {
            $query->where('status', $status);
        }

        return Inertia::render('Admin/Enquiries', [
            'enquiries' => $query->limit(100)->get(),
            'activeStatus' => is_string($status) ? $status : 'all',
        ]);
    }

    public function update(
        UpdateContactEnquiryRequest $request,
        ContactEnquiry $enquiry,
    ): RedirectResponse {
        $enquiry->update([
            'status' => $request->validated('status'),
            'handled_by' => $request->user()?->id,
            'handled_at' => now(),
        ]);

        return back()->with('success', 'Enquiry status updated.');
    }
}
