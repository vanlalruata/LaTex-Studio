New contact enquiry received.

Name: {{ $enquiry->name }}
Email: {{ $enquiry->email }}
Category: {{ $enquiry->category }}
Subject: {{ $enquiry->subject }}
@if($enquiry->organization)Organization: {{ $enquiry->organization }}
@endif
@if($enquiry->role)Role: {{ $enquiry->role }}
@endif

Message:
{{ $enquiry->message }}
