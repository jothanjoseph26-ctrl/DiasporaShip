# PAGE INVENTORY.md
# DiasporaShip — Complete Route & Page Design Inventory
# Generated from: app/ route tree · store/index.ts · types/index.ts · propose-design.md
# Total routes: 60 page.tsx files (3 route-group aliases excluded from design count = 57 design obligations)

---

## How to Read This Document

Each entry contains:
- **Route** — file path from app/
- **Portal** — which of the 8 portals owns this screen
- **Archetype** — page blueprint this screen maps to (see archetypes key below)
- **Design Status** — `DESIGNED` / `PARTIAL` / `MISSING`
- **Store hooks** — which Zustand stores this page consumes
- **Key data fields** — the specific fields from types/index.ts this page renders
- **Primary action** — the main CTA or user goal
- **Components needed** — custom components beyond shadcn primitives
- **Empty state CTA** — what the empty state prompts the user to do
- **Notes** — gaps, naming issues, or decisions needed

---

## Archetype Key

| Code | Archetype | Typical Structure |
|------|-----------|-------------------|
| `DASH` | Dashboard | KPI cards + charts + recent activity feed |
| `TABLE` | Data table + filters | Filter bar + sortable table + pagination |
| `DETAIL` | Full detail page | Header + info grid + timeline/history |
| `DRAWER` | Table + right drawer | TABLE with slide-in detail panel, no page nav |
| `WIZARD` | Multi-step flow | Step indicator + single content card + back/next |
| `SETTINGS` | Settings form | Tabbed sections + form fields + save button |
| `SEARCH` | Search / scanner | Search input + results list + scan mode |
| `MAP` | Map operations | Full-height map + floating controls + side panel |
| `REPORT` | Report / analytics | Period picker + charts + export button |
| `AUTH` | Auth page | Centered card + form + links |
| `EMPTY` | Empty first-use | Illustration + headline + single CTA |

---

## Status Normalization Note

The UI DESIGN.txt used informal badge labels. All entries below use the **canonical enum values** from `types/index.ts`. One status dictionary governs everything:

```
draft · pending_pickup · pickup_assigned · picked_up · at_warehouse ·
processing · customs_pending · customs_cleared · customs_held ·
in_transit_domestic · in_transit_international · at_destination_warehouse ·
out_for_delivery · delivered · failed_delivery · returned_to_sender ·
cancelled · on_hold
```

Badge label display strings (human-readable, used in UI only):
```
draft             → "Draft"
pending_pickup    → "Pending Pickup"       ← was "pending" in old doc
pickup_assigned   → "Pickup Assigned"      ← was "pickup-assign" in old doc
picked_up         → "Picked Up"
at_warehouse      → "At Warehouse"
processing        → "Processing"
customs_pending   → "Customs Pending"
customs_cleared   → "Customs Cleared"
customs_held      → "Customs Hold"
in_transit_domestic      → "In Transit"
in_transit_international → "In Transit"   ← same badge, different icon
at_destination_warehouse → "At Destination"
out_for_delivery  → "Out for Delivery"    ← was "out-delivery" in old doc
delivered         → "Delivered"
failed_delivery   → "Failed Delivery"
returned_to_sender → "Returned"
cancelled         → "Cancelled"
on_hold           → "On Hold"
```

---

## Route-Group Aliases (excluded from design count)

These paths exist in the file tree but are route-group redirects, not separate design obligations:

| Alias Route | Canonical Route | Notes |
|---|---|---|
| `app/(customer)/dashboard/page.tsx` | `app/customer/dashboard/page.tsx` | Same design, Next.js layout group |
| `app/(driver)/home/page.tsx` | `app/driver/home/page.tsx` | Same design, Next.js layout group |
| `app/customer/page.tsx` | `app/customer/dashboard/page.tsx` | Index redirect, no separate design needed |
| `app/driver/page.tsx` | `app/driver/home/page.tsx` | Index redirect |

**Design obligation count: 57 unique pages**

---

## SECTION 1 — MARKETING / PUBLIC

### 1.1 — `/` — Homepage
- **Portal:** Public / Marketing
- **Archetype:** Custom (full-screen marketing landing page)
- **Design Status:** `PARTIAL` — visual direction defined, sections specified, but no page-level brief linking sections to routes
- **Store hooks:** none (static + public tracking search)
- **Key data fields:** none — all static content
- **Primary action:** "Get a Free Quote" → `/customer/auth/register` (unauthenticated) or `/customer/shipments/new` (authenticated)
- **Secondary actions:** "Track a Shipment" → `/customer/track`, "Sign in" → `/customer/auth/login`
- **Sections required:**
  1. NavBar (fixed, warm-white, blurred)
  2. Hero — split layout: 4-photo animated grid left, headline + CTAs right
  3. Marquee band — scrolling corridor list (terra bg)
  4. Trust bar — partner logos
  5. How It Works — 4-step cards
  6. Features — dark section, 6-card grid
  7. Corridors — route cards with delivery times
  8. Stats — 4 metrics
  9. Testimonials — featured card + 2 secondary
  10. Pricing teaser — 3 tier cards
  11. CTA section — dark + quote widget
  12. Footer — 4-col
- **Components needed:** PhotoGrid (animated, built), NavBar, HowItWorks, CorridorCard, TestimonialCard, PricingCard
- **Empty state CTA:** n/a — static page
- **Notes:** PhotoGrid component is already built. Replace Unsplash URLs with real photos once sourced. Quote widget on CTA section should post to `/customer/auth/register?intent=quote`.

---

## SECTION 2 — CUSTOMER PORTAL

### 2.1 — `/customer/auth/login`
- **Portal:** Customer
- **Archetype:** `AUTH`
- **Design Status:** `MISSING`
- **Store hooks:** `useAuthStore`
- **Key data fields:** User.email, User.password (not stored), User.role
- **Primary action:** Submit login → redirect to `/customer/dashboard`
- **Layout:**
  - Left panel (50%): Brand panel. Dark ink bg. "DiasporaShip" logo centered. Playfair italic quote: *"Connecting families across the Atlantic."* Subtle gold diagonal line. Floating tracking card (same as homepage hero).
  - Right panel (50%): Cream bg. Centered form card (480px max-width).
  - Form card: Logo top, "Welcome back" H3, email input, password input + show/hide toggle, "Remember me" checkbox, "Forgot password?" link, Login button (terra, full width), divider "or", Google OAuth button (Phase 2 — render disabled with tooltip), "Don't have an account? Register" link.
- **Error states:** Wrong credentials → inline error below password: "Incorrect email or password." Rate limited → "Too many attempts. Try again in 10 minutes."
- **Mobile:** Single column. No brand panel. Logo top. Form centered. Same fields.
- **Components needed:** AuthCard, PasswordInput (with show/hide toggle)
- **Notes:** Do NOT specify which field is wrong (email vs password) in error message — security requirement from spec doc.

### 2.2 — `/customer/auth/register`
- **Portal:** Customer
- **Archetype:** `AUTH`
- **Design Status:** `MISSING`
- **Store hooks:** `useAuthStore`
- **Key data fields:** User.email, User.phone, User.firstName, User.lastName, User.countryOfResidence, User.accountType, User.businessName
- **Primary action:** Submit registration → email OTP verification → redirect to `/customer/dashboard`
- **Layout:** Same two-panel structure as login.
- **Form fields (in order):**
  1. First name + Last name (2-col row)
  2. Email address
  3. Phone number (with country code selector flag dropdown)
  4. Password + Confirm password (2-col row, strength indicator on password)
  5. Country of residence (searchable select)
  6. Account type toggle: "Individual" / "Business" — if Business, reveal Business name field
  7. Terms checkbox: "I agree to the Terms of Service and Privacy Policy"
  8. Register button (terra, full width)
  9. "Already have an account? Sign in" link
- **Password strength indicator:** 4-segment bar below password field. Segments fill: red (weak) → amber (fair) → gold (good) → green (strong). Rules: min 8 chars, 1 uppercase, 1 number.
- **After submit:** Redirect to `/customer/auth/verify` (OTP screen). Toast: "Check your email for a verification code."
- **Components needed:** AuthCard, PhoneInput (flag + number), PasswordStrengthBar, AccountTypeToggle

### 2.3 — `/customer/auth/forgot-password`
- **Portal:** Customer
- **Archetype:** `AUTH`
- **Design Status:** `MISSING`
- **Store hooks:** `useAuthStore`
- **Key data fields:** User.email
- **Primary action:** 3-step flow on single page (state machine, no page navigation)
- **Step 1 — Email entry:**
  - Input: Email address
  - Button: "Send Reset Code" (terra)
  - Link: "Back to login"
  - After submit: transition to Step 2
- **Step 2 — OTP entry:**
  - Text: "We sent a 6-digit code to {email}"
  - Input: 6-box OTP (auto-advance, backspace goes back)
  - Timer: "Resend code in 00:60" — countdown, becomes "Resend code" link after 0
  - Button: "Verify Code" (terra)
- **Step 3 — New password:**
  - Input: New password + Confirm password
  - Password strength indicator (same as register)
  - Button: "Reset Password" (terra)
  - On success: redirect to `/customer/auth/login` with success toast
- **Layout:** Single centered card (no brand panel needed — simpler than login/register)
- **Components needed:** OTPInput (6-box), PasswordStrengthBar

### 2.4 — `/customer/dashboard`
- **Portal:** Customer
- **Archetype:** `DASH`
- **Design Status:** `PARTIAL` — structure defined in UI DESIGN.txt Section 7.2, components listed
- **Store hooks:** `useShipmentStore`, `useWalletStore`, `useNotificationStore`
- **Key data fields:** Shipment (id, trackingNumber, status, destinationCountry, totalCost, createdAt) · Wallet (balanceUSD, balanceNGN) · KPIData (activeToday, delivered, onTimeRate)
- **Primary action:** "Ship Now" → `/customer/shipments/new`
- **Layout zones:**
  1. Greeting bar: "Good morning, {firstName}" + today's date. Quick action buttons: Ship Now, Track, Fund Wallet.
  2. KPI row (4-col): Active shipments, Total shipped all time, Wallet balance (primary currency), Delivery success rate.
  3. Main content (2-col 1fr/320px): Recent shipments list (5 cards) left | Wallet card widget right.
  4. Track input: Full-width search card with large input.
  5. Announcement banner (conditional, admin-controlled): gold-pale bg, dismissible.
- **Empty state (no shipments):** EmptyState component. Package icon. "No shipments yet." "Book your first shipment and we'll track it every step of the way." "Ship Now" CTA.
- **Components needed:** ShipmentCard, WalletCard, KpiCard, TrackInput, AnnouncementBanner

### 2.5 — `/customer/shipments`
- **Portal:** Customer
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useShipmentStore`
- **Key data fields:** Shipment (id, trackingNumber, status, shipmentType, serviceType, originCountry, destinationCountry, totalCost, createdAt, estimatedDeliveryDate)
- **Primary action:** "New Shipment" button (terra, top right) → `/customer/shipments/new`
- **Filter bar:**
  - Status dropdown: All + all 18 statuses (human-readable labels)
  - Type dropdown: All · parcel · cargo · document · fragile · cold_chain
  - Date range picker: From / To (defaults to last 30 days)
  - Search input: By tracking number or destination
  - Clear filters link (appears only when filters active)
- **Display modes:** Table (desktop) / Card list (mobile — same ShipmentCard from dashboard)
- **Table columns (desktop):** Tracking ID (mono terra) · Type badge · Route (origin → destination with flag emojis) · Service · Status badge · Date · Amount · Actions (download label icon, view icon)
- **Row click:** Navigate to `/customer/shipments/[id]`
- **Pagination:** 20 per page. "Showing 1–20 of 47 shipments" left, Prev/Next right.
- **Empty state (filtered):** Search icon. "No shipments match your filters." "Clear filters" link.
- **Empty state (no shipments ever):** Same as dashboard empty state.
- **Components needed:** ShipmentCard, StatusBadge, FilterBar, DataTable, Pagination

### 2.6 — `/customer/shipments/new`
- **Portal:** Customer
- **Archetype:** `WIZARD`
- **Design Status:** `PARTIAL` — 6 steps defined in UI DESIGN.txt Section 7.2, but no exact field-level spec for each step
- **Store hooks:** `useShipmentStore`, `useQuoteStore`, `useWalletStore`
- **Key data fields:** Quote (serviceId, serviceName, price, currency, estimatedDays, aiRecommended, confidenceScore, breakdown) · Shipment (all fields) · Wallet (balanceUSD, balanceNGN)
- **Step inventory:**
  1. **Type** — ShipmentType selector grid (6 icons): parcel · cargo · document · fragile · cold_chain + hint text per type
  2. **Package** — weightKg (required), lengthCm/widthCm/heightCm (optional, reveals volumetric weight calc), packageDescription (required), declaredValue (optional), isInsured toggle (shows insuranceCost preview when on)
  3. **Pickup** — Saved address selector OR new address form. Fields: recipientName, recipientPhone, addressLine1, addressLine2, city, stateProvince, postalCode, country. Google Maps autocomplete on addressLine1. pickupDate date picker (min: tomorrow).
  4. **Delivery** — Same as Pickup. "Same as pickup" toggle at top.
  5. **Service** — Quote cards list. Each card: courier logo placeholder, serviceName, price (large), estimatedDays, breakdown toggle (base + fuel + customs + insurance). AI recommended badge + confidence bar on top card. "Refresh rates" link if quote near expiry.
  6. **Review & Pay** — Full summary. Pickup address block. Delivery address block. Package summary. Selected service. Cost breakdown table. Payment method toggle: Wallet (shows balance, warns if insufficient) / Card (opens Stripe modal). "Confirm & Book" button.
- **Post-booking:** Success screen (not a new page — replaces wizard content). Tracking number (large, mono, copyable). "Download Label" button. "Track Shipment" link. "Ship Another" link.
- **State persistence:** All wizard state in `useQuoteStore` and `useShipmentStore`. Survives navigation within portal.
- **Components needed:** WizardStepIndicator, ShipmentTypeSelector, AddressForm, QuoteCard, CostBreakdown, PaymentMethodToggle, BookingSuccessCard

### 2.7 — `/customer/shipments/[id]`
- **Portal:** Customer
- **Archetype:** `DETAIL`
- **Design Status:** `PARTIAL` — described in UI DESIGN.txt Section 7.2 but no exact zone measurements
- **Store hooks:** `useShipmentStore`
- **Key data fields:** Shipment (all fields) · TrackingEvent (id, eventType, description, locationName, lat, lng, occurredAt, source) · Shipment.assignedDriverName
- **Layout:**
  - Page header: Tracking number (font-mono 20px terra, copyable) · Status badge (large) · Service name · Created date
  - Action bar (below header): Download Label · Download Invoice · Cancel button (only if status = pending_pickup) · Contact Support
  - Info grid (2-col): Pickup address card | Delivery address card
  - Package details row: Type badge, Weight, Dimensions, Description, Declared value — horizontal definition list
  - Cost breakdown card: itemized table (base / fuel / customs / insurance / total). Total row in bold.
  - Documents section: CustomsDocument list. Status badge per doc. Upload button. AI confidence badge.
  - Live driver map: Conditionally rendered only when status = out_for_delivery. Google Maps embed. Driver marker. Route line.
  - Tracking timeline: Full TrackingTimeline component. All events. Newest first.
- **Empty tracking state:** "Tracking updates will appear here once your shipment is picked up."
- **Components needed:** TrackingTimeline, AddressCard, CostBreakdown, DocumentList, LiveDriverMap, PODConfirmation

### 2.8 — `/customer/track`
- **Portal:** Customer (also accessible public at `/track`)
- **Archetype:** `SEARCH`
- **Design Status:** `MISSING`
- **Store hooks:** none on entry, `useShipmentStore` after search
- **Key data fields:** Shipment.trackingNumber (input) → resolves to PublicShipmentView
- **Layout:**
  - Centered on page (not in portal shell for public access, in portal shell for authenticated)
  - Hero search card: DiasporaShip logo. "Track your shipment" H2. Large tracking number input (font-mono placeholder "DS-YYYYMMDD-XXXXXX"). "Track" terra button. Recent searches (authenticated only, last 5 tracking numbers as chips below input).
  - Below search: animated illustration of the US→Africa route (reuse flight path from homepage hero)
- **After submit:** Redirect to `/customer/track/[trackingNumber]`
- **Components needed:** TrackingSearchCard, RecentSearchChips

### 2.9 — `/customer/track/[trackingNumber]`
- **Portal:** Customer / Public (no auth required)
- **Archetype:** `DETAIL` (read-only, public subset)
- **Design Status:** `MISSING`
- **Store hooks:** none (public API call by tracking number)
- **Key data fields:** Shipment (trackingNumber, status, serviceType, estimatedDeliveryDate, originCountry, destinationCountry) · TrackingEvent (description, locationName, occurredAt) — NO pricing, NO personal info
- **Layout:**
  - Top: DiasporaShip logo + "Track another" link
  - Status card: Large status badge + tracking number. Estimated delivery window. Route: origin country flag → destination country flag.
  - Progress bar: 5-stage visual (Collected / Customs / In Transit / At Hub / Delivered). Current stage highlighted in terra.
  - Tracking timeline: Public events only. No internal notes.
  - "Sign up to get live notifications" CTA banner (unauthenticated users only). Terra bg.
- **Not shown:** Pricing, customer name, internal notes, driver info, exact addresses
- **Components needed:** PublicStatusCard, ShipmentProgressBar, TrackingTimeline (read-only mode), SignupCtaBanner

### 2.10 — `/customer/wallet`
- **Portal:** Customer
- **Archetype:** Custom (wallet-specific layout)
- **Design Status:** `MISSING` — WalletCard component is specced but full page structure is not
- **Store hooks:** `useWalletStore`
- **Key data fields:** Wallet (balanceUSD, balanceNGN, balanceGHS, balanceKES, isFrozen) · Transaction (id, type, category, amount, currency, balanceBefore, balanceAfter, reference, shipmentId, description, createdAt)
- **Primary action:** "Fund Wallet" → opens Paystack/Stripe payment modal
- **Layout:**
  - Top: WalletCard (full width). Dark ink card. Currency tabs (USD / NGN / GHS / KES). Balance large. Fund Wallet button (gold). Exchange rate estimator link.
  - Below (2-col 1fr/280px):
    - Left: Transaction history table. Columns: Date · Description · Type (credit/debit badge) · Category · Amount · Balance after. Filter: All / Credits / Debits + date range.
    - Right: Quick stats card (Total in this month, Total out this month, Pending COD). + "Withdraw" section (Phase 2 — show disabled state with "Coming soon" badge).
  - Frozen wallet state: Warning banner at top. "Your wallet has been temporarily frozen. Contact support." Orange bg. Contact Support button.
- **Empty state (no transactions):** DollarSign icon. "No transactions yet." "Fund your wallet to start shipping." "Fund Wallet" CTA.
- **Components needed:** WalletCard, TransactionTable, WalletStatsCard, FundWalletModal

### 2.11 — `/customer/addresses`
- **Portal:** Customer
- **Archetype:** `TABLE` (card grid variant)
- **Design Status:** `MISSING`
- **Store hooks:** `useAuthStore` (addresses on user object)
- **Key data fields:** Address (id, label, type, recipientName, recipientPhone, addressLine1, city, stateProvince, country, isDefaultPickup, isDefaultDelivery)
- **Primary action:** "Add Address" button → opens AddressFormModal
- **Layout:**
  - Page header: "Saved Addresses" + "Add Address" button (terra, top right)
  - Address cards grid (2-col desktop, 1-col mobile):
    - Each card: Label badge (Home/Office/Warehouse) · Recipient name · Full address block · Phone · Default pickup badge (terra) / Default delivery badge (gold) if applicable · Edit icon · Delete icon · "Set as default" dropdown (pickup / delivery / both)
  - No filter bar needed (users rarely have >10 addresses)
- **Empty state:** MapPin icon. "No saved addresses." "Save addresses to speed up future bookings." "Add Address" CTA.
- **Add/Edit modal:** AddressForm with Google Maps autocomplete. All Address fields. Save button.
- **Delete confirmation:** Inline confirm — row turns red bg, "Delete this address?" with Confirm/Cancel. No separate modal.
- **Components needed:** AddressCard, AddressFormModal

### 2.12 — `/customer/documents`
- **Portal:** Customer
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useShipmentStore` (documents are on shipments)
- **Key data fields:** CustomsDocument (id, shipmentId, documentType, fileUrl, fileName, aiExtractedData, aiConfidenceScore, status, reviewedAt, rejectionReason, expiryDate, createdAt)
- **Primary action:** "Upload Document" → opens DocumentUploadModal
- **Layout:**
  - Filter bar: Document type filter · Status filter · Shipment search
  - Table: Shipment ID (mono link) · Document type · File name · AI confidence badge · Status badge · Uploaded · Expiry (red if <30 days) · Actions (download, view, delete)
  - Expiry alerts: Banner at top if any documents expire within 30 days. Amber bg. Lists expiring docs.
- **AI confidence badge:** Green ≥90% · Amber 70–89% · Red <70%
- **Document status badges:** uploaded · reviewed · approved (green) · rejected (red) · expired (gray)
- **Empty state:** FileText icon. "No documents uploaded." "Documents will appear here when you add them to a shipment." No CTA (upload is per-shipment).
- **Components needed:** DocumentTable, DocumentUploadModal, AIConfidenceBadge, ExpiryAlertBanner

### 2.13 — `/customer/settings`
- **Portal:** Customer
- **Archetype:** `SETTINGS`
- **Design Status:** `MISSING`
- **Store hooks:** `useAuthStore`
- **Key data fields:** User (firstName, lastName, businessName, phone, countryOfResidence, preferredCurrency, preferredLanguage, avatarUrl, kycStatus)
- **Tabs:**
  1. **Profile** — Avatar upload (circle crop, S3 upload). First/Last name. Business name (if accountType = business). Phone + country code. Country of residence. Save button.
  2. **Security** — Change password: current password + new password + confirm. Password strength bar. Active sessions list (Phase 2 — show "Coming soon"). 2FA setup (Phase 2 — show "Coming soon").
  3. **Preferences** — Preferred currency (USD/NGN/GHS/KES selector). Preferred language (EN/FR — FR disabled "Coming soon"). Notification preferences: toggle grid (email, SMS, push) × (shipment updates, wallet activity, promotions).
  4. **KYC** — Current KYC status badge. If none/rejected: upload form with document type selector + file upload. If pending: "Under review" state with timeline. If approved: green verified badge with verified date.
  5. **Danger zone** — "Delete Account" button (danger outline). Opens confirmation modal requiring email re-entry.
- **Components needed:** AvatarUpload, PasswordChangeForm, PasswordStrengthBar, NotificationToggleGrid, KYCUploadForm, DangerZone

---

## SECTION 3 — DRIVER PORTAL

### 3.1 — `/driver/home` (canonical for `(driver)/home` alias)
- **Portal:** Driver
- **Archetype:** `DASH`
- **Design Status:** `PARTIAL` — structure defined but zone measurements missing
- **Store hooks:** `useDriverStore`, `useShipmentStore`
- **Key data fields:** Driver (isOnline, isAvailable, status, totalDeliveries, onTimeRate, rating, earningsBalance, activeShipments, completedToday) · Shipment (assigned to this driver)
- **Primary action:** Online/Offline toggle (hero element, not a button — large pill, center screen)
- **Layout zones:**
  1. Status toggle: 120px height card. Centered. Large pill toggle (green = online, gray = offline). Status text below: "Available · Waiting for jobs"
  2. Active job card (conditional, only when status = on_pickup or on_delivery): Ink bg. Job type badge. Address. Package type. Distance. "Navigate" button (terra).
  3. Earnings today strip (3-col): Today's earnings · This week · Completion rate
  4. Pending jobs list: Up to 3 upcoming assigned jobs. Each: address, distance, time window, package type. "View all" link → `/driver/jobs/queue`
- **Offline state:** All job cards hidden. Single centered message: "You're offline — go online to receive deliveries."
- **Components needed:** DriverStatusToggle, ActiveJobCard, EarningsStrip, PendingJobCard

### 3.2 — `/driver/jobs/queue`
- **Portal:** Driver
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore`, `useShipmentStore`
- **Key data fields:** Shipment (id, trackingNumber, status, pickupAddress, deliveryAddress, shipmentType, weightKg, assignedDriverId, pickupDate) · Driver.activeShipments
- **Primary action:** Tap job → `/driver/jobs/[id]`
- **Filter bar:** All · Pickup · Delivery · Priority
- **List layout (mobile-first card list):**
  - Job card: Job type badge (Pickup/Delivery, color-coded). Address (bold). Distance from current location. Package type + weight. Pickup window. Priority badge (if urgent). Chevron right.
- **Empty state:** CheckCircle icon. "No jobs in queue." "You're all caught up. Stay online to receive new assignments."
- **Components needed:** JobQueueCard

### 3.3 — `/driver/jobs/[id]`
- **Portal:** Driver
- **Archetype:** `DETAIL`
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore`, `useShipmentStore`
- **Key data fields:** Shipment (trackingNumber, status, pickupAddress, deliveryAddress, packageDescription, weightKg, shipmentType, assignedDriverName) · Driver.status
- **Layout:**
  - Header: Tracking number · Job type badge · Status badge
  - Map section: Google Maps embed. Route from driver current location to pickup/delivery. 260px height.
  - Address card: Full address. Recipient name. Phone (tap to call).
  - Package details: Type, weight, description, special instructions.
  - Status flow buttons (changes based on current status):
    - status = pickup_assigned → "Start Pickup" button (terra, full width)
    - status = picked_up → "Confirm Pickup" button
    - status = out_for_delivery → "Confirm Delivery" button → opens POD flow
    - status = failed_delivery → "Report Failed Delivery" button (danger)
  - POD flow (inline, replaces buttons): Photo upload, Signature pad, OTP input (conditional), geo-stamp indicator, "Submit Delivery" button.
- **Components needed:** JobMap, RecipientCard, StatusActionButton, PODCaptureForm (photo + signature + OTP)

### 3.4 — `/driver/earnings`
- **Portal:** Driver
- **Archetype:** `REPORT`
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore`, `useWalletStore`
- **Key data fields:** Driver (earningsBalance, totalDeliveries, onTimeRate) · Transaction (type = driver_earning, amount, currency, createdAt, shipmentId)
- **Primary action:** "Request Payout" button (gold) — disabled if balance < minimum threshold
- **Layout:**
  - Period tabs: Today / This Week / This Month / All Time
  - Summary cards (3-col): Total earned (period) · Deliveries completed · Average per delivery
  - Earnings chart: Bar chart, daily bars, terra color. Height = earnings amount.
  - Payout section: Current balance (large, ink card). "Request Payout" gold button. Minimum threshold note. Payout history table.
  - Per-trip earnings list: Date · Route (city → city) · Job type · Amount · Status (paid/pending)
- **Payout request flow:** Confirm modal. Shows amount. Bank details on file (or "Add bank details" link). Confirm button.
- **Empty state (no earnings):** DollarSign icon. "No earnings yet." "Complete your first delivery to start earning."
- **Components needed:** EarningsSummaryCard, EarningsChart, PayoutSection, TripEarningsList

### 3.5 — `/driver/profile`
- **Portal:** Driver
- **Archetype:** `SETTINGS` (read-heavy, edit-light)
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore`, `useAuthStore`
- **Key data fields:** Driver (name, avatar, phone, licenseNumber, licenseExpiry, vehicleType, currentVehiclePlate, totalDeliveries, onTimeRate, rating, branchName) · User (email, kycStatus)
- **Layout:**
  - Profile header: Avatar (80px). Name. Rating stars. Branch name badge. Edit button.
  - Stats row: Total deliveries · On-time rate · Rating
  - Details section: License number · License expiry (red if <60 days) · Vehicle plate · Vehicle type · Branch
  - Documents section: License image, Insurance doc. Upload/replace buttons. Expiry warnings.
  - Performance section: Last 30 days chart — deliveries per day (mini bar chart).
- **Components needed:** DriverProfileHeader, DriverStatsRow, DocumentExpiryCard

### 3.6 — `/driver/settings`
- **Portal:** Driver
- **Archetype:** `SETTINGS`
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore`, `useAuthStore`
- **Key data fields:** User (email, phone, preferredLanguage) · Driver (push_token)
- **Tabs:**
  1. **Account** — Change name, phone, email. Change password.
  2. **Notifications** — Push toggles: New job assigned, Job updated, Payout processed. SMS toggles: same.
  3. **App preferences** — Language selector. Map provider preference (Google Maps / Apple Maps). Dark mode toggle.
- **Components needed:** Standard settings form components (reuse from customer settings)

---

## SECTION 4 — DISPATCH PORTAL

### 4.1 — `/dispatch` (index = `/dispatch/map`)
- **Portal:** Dispatch
- **Archetype:** `MAP`
- **Design Status:** `PARTIAL` — described in UI DESIGN.txt Section 7.4 but no zone measurements
- **Store hooks:** `useDriverStore`, `useShipmentStore`, `useVehicleStore`
- **Key data fields:** Driver (id, name, currentLocation, status, isOnline, activeShipments) · Vehicle (id, plateNumber, type, status, lastLat, lastLng) · Shipment (id, status, pickupAddress, deliveryAddress, assignedDriverId)
- **Layout:** Full viewport minus sidebar (240px) and topbar (56px). Zero padding. Map is edge-to-edge.
- **Map elements:**
  - Driver markers: Custom SVG pin 32px. Green = available, Terra = on trip, Gray = offline.
  - Unassigned shipment pins: Amber dot 20px. Click → assign job modal.
  - Route polylines: Blue dashed line from driver to their active delivery.
  - Geofence rings: Light opacity circles around warehouses and hubs.
- **Floating controls (top-left, z:10):** Country filter chips (US/NG/GH/KE). Status filter (All/Online/On Trip). Refresh icon button. Fullscreen toggle.
- **Stats card (top-right, z:10):** Translucent dark card. Online: N. Active trips: N. Unassigned: N. Updates every 30s.
- **Right drawer (320px, slides in on driver click):** Driver avatar + name + phone + status badge. Current vehicle plate. Active job summary. Assign Job button (terra). Unassign button (danger ghost). Contact button.
- **Bottom drawer (mobile):** Same driver info as right drawer but bottom sheet.
- **Components needed:** DispatchMap, DriverMarker, ShipmentPin, DriverDetailDrawer, MapControlBar, MapStatsCard

### 4.2 — `/dispatch/shipments`
- **Portal:** Dispatch
- **Archetype:** `DRAWER`
- **Design Status:** `MISSING`
- **Store hooks:** `useShipmentStore`, `useDriverStore`
- **Key data fields:** Shipment (id, trackingNumber, status, pickupAddress, deliveryAddress, assignedDriverId, assignedDriverName, shipmentType, weightKg, pickupDate)
- **Primary action:** Assign driver to unassigned shipments
- **Layout:** Full DataTable with right drawer on row click.
- **Filter bar:** Status filter (focus on operational statuses: pending_pickup, pickup_assigned, picked_up, out_for_delivery) · Driver filter (assigned/unassigned) · Priority filter · Country filter
- **Table columns:** Tracking ID · Type · Route · Status badge · Assigned driver (or "Unassigned" red badge) · Pickup date · Weight · Actions
- **Right drawer:** Full shipment summary. Assign Driver section: available driver list with distance from pickup. Assign button.
- **Unassigned highlight:** Rows with no assignedDriverId have left border: 3px red.
- **Components needed:** DispatchShipmentsTable, AssignDriverDrawer, AvailableDriverList

### 4.3 — `/dispatch/routes`
- **Portal:** Dispatch
- **Archetype:** `MAP` + table hybrid
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore`, `useShipmentStore`
- **Key data fields:** Driver (id, name, currentLocation, activeShipments) · Shipment (pickupAddress, deliveryAddress)
- **Primary action:** Generate optimized route for a driver's job queue
- **Layout:**
  - Left panel (420px): Driver selector dropdown. Selected driver's job list (drag to reorder). "Optimize Route" button (terra). Estimated total time/distance summary.
  - Right panel (rest): Google Maps embed. Route polyline with numbered waypoints. Driver start marker.
- **Route optimization:** Calls Google Route Optimization API. Returns ordered waypoints. Updates map polyline.
- **Components needed:** RouteBuilder, WaypointList (draggable), RouteMap

### 4.4 — `/dispatch/fleet`
- **Portal:** Dispatch
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useVehicleStore`, `useDriverStore`
- **Key data fields:** Vehicle (id, plateNumber, type, make, model, capacityKg, country, currentDriverId, currentDriverName, status, lastLat, lastLng) · Driver (name, isOnline, status)
- **Table columns:** Plate · Type badge · Make/Model · Capacity · Country · Driver (linked) · Status badge · Last GPS · Actions (view on map, edit)
- **Status badges:** available (green) · on_trip (blue) · maintenance (amber) · inactive (gray)
- **Filter bar:** Country · Type · Status · Driver assigned/unassigned
- **Row click:** Opens vehicle detail drawer: full vehicle info, maintenance log, trip history (last 5 trips), current GPS on mini map.
- **Components needed:** FleetTable, VehicleDetailDrawer, MiniMap

### 4.5 — `/dispatch/broadcast`
- **Portal:** Dispatch
- **Archetype:** Custom (message compose)
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore`
- **Key data fields:** Driver (id, name, isOnline, status, branchName, country)
- **Primary action:** Send message to driver group
- **Layout:**
  - Left (420px): Message composer card. "Send to" target selector: All Drivers / By Country (chip multi-select) / By Branch / Specific drivers (search + add). Message textarea (max 500 chars, counter). Send button (terra). Preview count: "Sending to N drivers."
  - Right: Recipient list preview. Driver cards with online/offline indicator.
- **Message history:** Below composer. List of recent broadcasts. Sender · Target · Message preview · Time · Delivery count.
- **Components needed:** BroadcastComposer, RecipientPreview, MessageHistory

---

## SECTION 5 — WAREHOUSE PORTAL

### 5.1 — `/warehouse` (overview)
- **Portal:** Warehouse
- **Archetype:** `DASH`
- **Design Status:** `MISSING`
- **Store hooks:** `useWarehouseStore`, `useShipmentStore`
- **Key data fields:** Warehouse (id, name, capacityM3, usedCapacityM3, country, isActive) · Shipment (status = at_warehouse or at_destination_warehouse)
- **Layout:**
  - KPI row (4-col): Items in storage · Receiving today · Dispatching today · Capacity used %
  - Capacity gauge: Visual fill bar per warehouse. Green <70%, Amber 70-89%, Red ≥90%.
  - Recent activity: Received today list + Dispatched today list (2-col)
  - Pending actions: Items awaiting dispatch. Items with missing customs docs.
- **Components needed:** CapacityGauge, WarehouseActivityList

### 5.2 — `/warehouse/receive`
- **Portal:** Warehouse
- **Archetype:** `SEARCH` (scan-first)
- **Design Status:** `PARTIAL` — described in UI DESIGN.txt Section 7.5 but no field-level spec
- **Store hooks:** `useShipmentStore`, `useWarehouseStore`
- **Key data fields:** Shipment (trackingNumber, weightKg, packageDescription, shipmentType, pickupAddress, deliveryAddress, declaredValue) · Warehouse (id, name)
- **Primary action:** Scan or enter tracking number → confirm receipt
- **Layout (tablet-optimized, large touch targets):**
  - Top: Warehouse selector (if staff manages multiple). Current warehouse name + country flag.
  - Scanner section: Large input (font-size 18px, auto-focus). Barcode icon left. "Scan with camera" toggle. Submit button (terra, 48px height).
  - After scan — shipment card appears below (replaces scanner):
    - Tracking number · Customer name · Route · Expected weight
    - Actual weight input (pre-filled from booking, editable)
    - Bin location input: auto-suggest based on type/weight · Manual override
    - Condition: "Good" / "Damaged" toggle
    - Photo capture: optional but recommended
    - "Confirm Receipt" button (green, full width, 56px height)
  - Success state: Green checkmark animation. "Received — [TRACKING ID]". "Receive another" button resets scanner.
- **Components needed:** BarcodeInput, ShipmentReceiveCard, BinAssignment, PhotoCapture, ReceiveSuccessState

### 5.3 — `/warehouse/inventory`
- **Portal:** Warehouse
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useWarehouseStore`, `useShipmentStore`
- **Key data fields:** Shipment (id, trackingNumber, status, shipmentType, weightKg, packageDescription, customsDocsStatus) · Warehouse (name, country)
- **Filter bar:** Warehouse selector · Status filter (at_warehouse / processing / customs_pending / customs_cleared) · Doc status filter · Search by tracking or customer
- **Table columns:** Bin location · Tracking ID (mono) · Customer · Destination · Type badge · Weight · Docs status badge · Days in warehouse (computed, red if >5 days) · Actions
- **Days in warehouse warning:** Row bg turns gold-pale if >5 days, red-pale if >10 days.
- **Bulk actions:** Select multiple → "Batch dispatch" or "Flag for customs"
- **Components needed:** InventoryTable, DaysWarningIndicator, BatchActionBar

### 5.4 — `/warehouse/dispatch`
- **Portal:** Warehouse
- **Archetype:** `TABLE` + action flow
- **Design Status:** `MISSING`
- **Store hooks:** `useWarehouseStore`, `useShipmentStore`, `useVehicleStore`
- **Key data fields:** Shipment (status = customs_cleared or at_destination_warehouse) · Vehicle (id, plateNumber, type, capacityKg) · Warehouse (name)
- **Primary action:** Batch dispatch — select items, assign vehicle, confirm
- **Layout:**
  - Left (table): Items ready for dispatch. Checkboxes. Same columns as inventory but filtered to dispatch-ready.
  - Right panel (320px): "Dispatch Summary". Selected items count + total weight. Vehicle selector dropdown. Carrier field (for international handoff). "Print Manifest" button (generates PDF). "Confirm Dispatch" button (terra).
  - After dispatch: All selected items get status update. Tracking events created. Manifest PDF opens.
- **Components needed:** DispatchSelectionTable, DispatchSummaryPanel, ManifestGenerator

### 5.5 — `/warehouse/search`
- **Portal:** Warehouse
- **Archetype:** `SEARCH`
- **Design Status:** `MISSING`
- **Store hooks:** `useWarehouseStore`, `useShipmentStore`
- **Key data fields:** Shipment (trackingNumber, status, packageDescription) · Warehouse (name, country)
- **Primary action:** Find any item across all warehouses instantly
- **Layout:**
  - Large search input (auto-focus, full width). Search by: tracking number, customer name, barcode, or bin location.
  - Search mode chips: "All warehouses" / "This warehouse" / "In transit"
  - Results: Card list. Each card: Tracking ID, Current warehouse + bin location, Status badge, Customer, Destination, Quick actions (view, move, dispatch).
  - Scan mode: Toggle switches input to camera barcode scanning.
- **Empty/no-results state:** Search icon. "Nothing found for {query}." "Check the tracking number and try again."
- **Components needed:** UniversalSearchInput, ItemResultCard, ScanModeToggle

### 5.6 — `/warehouse/reports`
- **Portal:** Warehouse
- **Archetype:** `REPORT`
- **Design Status:** `MISSING`
- **Store hooks:** `useWarehouseStore`, `useShipmentStore`
- **Key data fields:** Warehouse metrics aggregated by period
- **Layout:**
  - Period selector: Today / Week / Month
  - Warehouse selector (if multiple)
  - KPI summary: Items received, Items dispatched, Avg dwell time, Capacity utilization
  - Charts: Throughput line chart (received vs dispatched per day) · Dwell time distribution histogram · Item type breakdown donut
  - Export: CSV download button
- **Components needed:** Standard chart components (Recharts), ReportExportButton

---

## SECTION 6 — CUSTOMS PORTAL

### 6.1 — `/customs` (pending review queue)
- **Portal:** Customs
- **Archetype:** `DRAWER`
- **Design Status:** `PARTIAL` — described in UI DESIGN.txt Section 7.6
- **Store hooks:** `useShipmentStore`
- **Key data fields:** Shipment (status = customs_pending) · CustomsDocument (documentType, fileUrl, aiExtractedData, aiConfidenceScore, status)
- **Primary action:** Review and approve/reject customs documents
- **Queue stats (3 cards):** Pending review · Cleared today · On hold
- **Table columns:** Shipment ID · Customer · Route · Doc types uploaded · AI confidence badge · Uploaded date · Action (Review button)
- **Review drawer (480px):** Document viewer (PDF/image embed, full height). AI extracted fields panel. Field comparison: extracted vs declared. Approve button (green). Hold button (amber). Reject button (red). Notes textarea (required on rejection).
- **AI confidence colors:** ≥90% green · 70–89% amber · <70% red · Missing = gray "Not processed"
- **Components needed:** CustomsQueueTable, DocumentReviewDrawer, AIExtractedFieldsPanel, DocumentViewer

### 6.2 — `/customs/shipments`
- **Portal:** Customs
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useShipmentStore`
- **Key data fields:** Shipment (all customs-relevant fields: hsCode, customsDocsStatus, customsDuties, declaredValue, originCountry, destinationCountry)
- **Filter bar:** Status (customs_pending / customs_cleared / customs_held / in_transit_international) · Country · Date range
- **Table columns:** Tracking ID · Customer · Route · HS Code · Declared value · Duties estimate · Docs status · Shipment status · Updated
- **Components needed:** Standard DataTable

### 6.3 — `/customs/documents`
- **Portal:** Customs
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useShipmentStore`
- **Key data fields:** CustomsDocument (all fields)
- **Filter bar:** Document type · Status · AI confidence filter · Date range
- **Table columns:** Shipment ID · Doc type · File name · AI confidence · Status badge · Uploaded · Expiry · Actions (view, approve, reject)
- **Components needed:** DocumentTable (extends customer DocumentTable with action columns)

### 6.4 — `/customs/reports`
- **Portal:** Customs
- **Archetype:** `REPORT`
- **Design Status:** `MISSING`
- **Store hooks:** `useShipmentStore`
- **Data:** Clearance rates by corridor · Average clearance time · Hold reasons distribution · Duties collected
- **Components needed:** Standard Recharts components

### 6.5 — `/customs/settings`
- **Portal:** Customs
- **Archetype:** `SETTINGS`
- **Design Status:** `MISSING`
- **Tabs:** Account (name, email, password) · Notifications (email/push for new queue items, holds) · Rules (Phase 2 — compliance rule engine)
- **Components needed:** Standard settings form

---

## SECTION 7 — AGENT PORTAL

### 7.1 — `/agent` (branch overview)
- **Portal:** Agent
- **Archetype:** `DASH`
- **Design Status:** `PARTIAL` — described in UI DESIGN.txt Section 7.7
- **Store hooks:** `useBranchStore`, `useShipmentStore`, `useDriverStore`
- **Key data fields:** Branch (name, type, country, commissionRate, shipmentCount, revenue) · Shipment (filtered by branchId) · Driver (filtered by branchId)
- **Layout:**
  - Branch header: Branch name (Playfair 700 20px) + city + country flag. Commission rate gold badge.
  - KPI row (4-col): Shipments today · Revenue this month · Customers total · Active local drivers
  - Cash reconciliation widget: COD collected today (large number, gold) · Pending payout · "Request Settlement" button
  - Local shipments table (recent 10): Same as admin but branch-filtered
- **Components needed:** BranchHeader, CashReconciliationWidget

### 7.2 — `/agent/shipments`
- **Portal:** Agent
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useShipmentStore` (filtered by branchId)
- **Same structure as admin shipments table but:**
  - Filtered to this branch's shipments only
  - No ability to reassign to other branches
  - Can update status for local deliveries
- **Components needed:** Reuse DataTable with branch filter

### 7.3 — `/agent/customers`
- **Portal:** Agent
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useAuthStore` (users filtered by branch)
- **Key data fields:** User (id, firstName, lastName, email, phone, accountType, kycStatus, createdAt) + computed: shipmentCount, totalSpend
- **Table columns:** Name · Email · Phone · Account type · KYC badge · Shipments · Total spend · Joined · Actions
- **Row click:** Right drawer. User profile summary. Shipment history (mini table). Contact options.
- **Components needed:** CustomerTable, CustomerDetailDrawer

### 7.4 — `/agent/drivers`
- **Portal:** Agent
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore` (filtered by branchId)
- **Key data fields:** Driver (name, phone, isOnline, status, totalDeliveries, onTimeRate, rating, earningsBalance)
- **Table columns:** Name · Phone · Status badge · Deliveries · On-time rate · Rating · Earnings balance · Actions
- **Components needed:** Reuse DataTable

### 7.5 — `/agent/reports`
- **Portal:** Agent
- **Archetype:** `REPORT`
- **Design Status:** `MISSING`
- **Store hooks:** `useBranchStore`, `useShipmentStore`
- **Data:** Branch revenue by period · Shipment volume · Top customers · Commission earned · COD reconciliation history
- **Components needed:** Standard Recharts + ReportExportButton

### 7.6 — `/agent/settings`
- **Portal:** Agent
- **Archetype:** `SETTINGS`
- **Design Status:** `MISSING`
- **Tabs:** Account · Notifications · Branch info (read-only for agents, editable for branch managers)
- **Components needed:** Standard settings form

---

## SECTION 8 — ADMIN PORTAL

### 8.1 — `/admin` (dashboard)
- **Portal:** Admin
- **Archetype:** `DASH`
- **Design Status:** `DESIGNED` — fully specified in UI DESIGN.txt Section 7.1 and implemented in admin/page.tsx
- **Store hooks:** `useAdminStore`, `useShipmentStore`, `useDriverStore`
- **Notes:** Confirm KPI field names match KPIData type: totalShipments, activeToday, inTransit, delivered, delayed, revenue, revenueChange, onTimeRate, avgDeliveryTime, activeDrivers, totalDrivers, fleetUtilization, pendingPayments, customsHolds.

### 8.2 — `/admin/shipments`
- **Portal:** Admin
- **Archetype:** `DRAWER`
- **Design Status:** `PARTIAL` — described in UI DESIGN.txt Section 7.1
- **Store hooks:** `useShipmentStore`
- **Key data fields:** Shipment (all fields)
- **Enhancements over customer table:**
  - All 18 statuses filterable
  - Admin can manually update status inline
  - Courier filter
  - Branch filter
  - Export CSV button
  - Bulk status update
- **Components needed:** AdminShipmentsTable (extends DataTable), StatusUpdateDrawer

### 8.3 — `/admin/users`
- **Portal:** Admin
- **Archetype:** `DRAWER`
- **Design Status:** `PARTIAL` — described in UI DESIGN.txt Section 7.1
- **Store hooks:** `useAuthStore`
- **Key data fields:** User (all fields) + computed: shipmentCount, walletBalance
- **Right drawer sections:** Profile · Shipment history · Wallet audit trail · KYC documents viewer · Actions (activate/deactivate, change role, adjust wallet, reset password)
- **Components needed:** AdminUserDrawer, KYCDocumentViewer, WalletAuditTrail

### 8.4 — `/admin/kyc`
- **Portal:** Admin
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useAuthStore`
- **Key data fields:** User (id, firstName, lastName, email, kycStatus, kycDocuments)
- **Filter bar:** KYC status (pending / approved / rejected / none) · Account type · Country · Date submitted
- **Table columns:** User · Email · Account type · Country · Doc types submitted · Submitted date · Status badge · Review button
- **Review flow:** Same DocumentReviewDrawer pattern as customs portal. Shows ID doc + selfie (if required). Approve / Reject with reason. Status updates User.kycStatus.
- **KPI strip:** Pending review count · Approved today · Rejected today
- **Components needed:** KYCReviewTable, KYCReviewDrawer (reuses DocumentReviewDrawer)

### 8.5 — `/admin/drivers`
- **Portal:** Admin
- **Archetype:** `DRAWER`
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore`
- **Key data fields:** Driver (all fields) · Vehicle (linked by currentVehiclePlate)
- **Filter bar:** Country · Branch · Status (online/offline/on_trip) · Vehicle type
- **Table columns:** Name · Phone · Branch · Vehicle plate · Status badge · Total deliveries · On-time rate · Rating · Earnings balance · Actions
- **Right drawer:** Full driver profile. Performance chart (last 30 days deliveries). Document expiry warnings. Active job map. Assign/Unassign vehicle. Activate/Deactivate.
- **Components needed:** DriverManagementTable, DriverAdminDrawer

### 8.6 — `/admin/vehicles`
- **Portal:** Admin
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useVehicleStore`, `useDriverStore`
- **Key data fields:** Vehicle (all fields) · Driver (linked by currentDriverId)
- **Filter bar:** Country · Type · Status · Driver assigned/unassigned
- **Table columns:** Plate · Type badge · Make/Model/Year · Capacity · Country · Current driver · Status badge · Insurance expiry (red if <30 days) · Last GPS · Actions
- **Add vehicle modal:** All Vehicle fields. Insurance + road worthiness doc upload slots.
- **Components needed:** VehicleTable, AddVehicleModal, VehicleDetailDrawer

### 8.7 — `/admin/map`
- **Portal:** Admin
- **Archetype:** `MAP`
- **Design Status:** `MISSING`
- **Store hooks:** `useDriverStore`, `useShipmentStore`, `useVehicleStore`
- **Same as `/dispatch/map` but:**
  - Read-only (admin view, no job assignment from this screen — that belongs in dispatch)
  - Shows all corridors (US + Africa simultaneously on world map)
  - Shipment flow visualization: animated dots for in-transit international shipments
  - Filter by corridor (US→NG, US→GH, US→KE, UK→NG)
- **Components needed:** AdminWorldMap (extends DispatchMap with corridor layer)

### 8.8 — `/admin/warehouse`
- **Portal:** Admin
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useWarehouseStore`
- **Key data fields:** Warehouse (all fields)
- **Table columns:** Name · Type badge · Country · Address · Manager · Capacity % bar · Status badge · Actions
- **Add warehouse modal:** All Warehouse fields.
- **Capacity bar:** Visual inline progress bar. Green/amber/red by fill %.
- **Components needed:** WarehouseManagementTable, CapacityBar, AddWarehouseModal

### 8.9 — `/admin/customs`
- **Portal:** Admin
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useShipmentStore`
- **Key data fields:** Shipment (customs-relevant fields) · CustomsDocument (status, aiConfidenceScore)
- **Similar to customs portal but admin has override powers:**
  - Can force-clear or force-hold any shipment
  - Can reassign customs officer
  - Sees all corridors not just one
- **Components needed:** AdminCustomsTable, ForceStatusModal

### 8.10 — `/admin/branches`
- **Portal:** Admin
- **Archetype:** `TABLE`
- **Design Status:** `MISSING`
- **Store hooks:** `useBranchStore`
- **Key data fields:** Branch (all fields)
- **Table columns:** Name · Type badge · Country · Manager · Shipments this month · Revenue · Commission rate · Status badge · Actions
- **Branch hierarchy view toggle:** Toggle between flat table and tree view showing HQ → branches → agents.
- **Add/Edit branch modal:** All Branch fields. Parent branch selector for hierarchy.
- **Components needed:** BranchTable, BranchTreeView, BranchFormModal

### 8.11 — `/admin/billing`
- **Portal:** Admin
- **Archetype:** `TABLE` + `REPORT`
- **Design Status:** `MISSING`
- **Store hooks:** `useWalletStore`, `useShipmentStore`
- **Key data fields:** Transaction (all fields) · Wallet (all fields) · Shipment.paymentStatus
- **Layout:**
  - KPI strip: Revenue today · Pending payments · COD outstanding · Refunds issued
  - Transactions table: All platform transactions. Columns: Date · User · Type · Category · Amount · Currency · Reference · Status
  - Filter: By type (credit/debit) · By category · By currency · Date range
  - Corporate invoices section (Phase 2): Invoice list, generate, send.
- **Components needed:** TransactionTable, BillingKPIStrip

### 8.12 — `/admin/support`
- **Portal:** Admin
- **Archetype:** `TABLE` + chat
- **Design Status:** `MISSING`
- **Store hooks:** none (Phase 1 stub)
- **Key data fields:** None in current store — this is Phase 2 functionality
- **Phase 1 implementation:** Simple table of support email threads. Link to email client. "Coming in Phase 2" banner at top.
- **Phase 2 (full):** Ticket table with status, priority, assignee. Right drawer with conversation thread. Reply input.
- **Components needed:** Phase 1: ComingSoonBanner + basic table stub

### 8.13 — `/admin/analytics`
- **Portal:** Admin
- **Archetype:** `REPORT`
- **Design Status:** `PARTIAL` — mentioned in UI DESIGN.txt Section 7.8 but only overview described
- **Store hooks:** `useAdminStore`, `useShipmentStore`, `useDriverStore`
- **Key data fields:** KPIData (all fields) · Shipment (aggregated) · Driver (aggregated)
- **Layout:**
  - Period selector: sticky top bar. Today / Week / Month / Quarter / Year / Custom.
  - Revenue section: LineChart (revenue vs prev period). By corridor BarChart. By payment method donut.
  - Operations section: On-time rate gauge. Delivery time distribution AreaChart. Exception rate by status.
  - Customers section: New vs returning BarChart. Top 10 by volume table. LTV distribution.
  - Drivers section: Deliveries per driver ranking. On-time rate comparison. Earnings distribution.
  - Export: "Download PDF Report" button (Puppeteer-generated). "Export CSV" button.
- **Components needed:** AnalyticsPeriodSelector, RevenueChart, OperationsMetrics, CustomerMetrics, DriverMetrics, ExportPanel

### 8.14 — `/admin/settings`
- **Portal:** Admin
- **Archetype:** `SETTINGS`
- **Design Status:** `MISSING`
- **Tabs:**
  1. **Platform** — Platform name, logo upload, support email, contact phone.
  2. **Corridors** — Enable/disable corridors. Base rate config per corridor (Phase 2 — show read-only).
  3. **Couriers** — Courier list: toggle active/inactive. API key status (encrypted, shows "Configured" or "Missing"). Test connection button.
  4. **Notifications** — Global SMS/email toggle. Provider status indicators.
  5. **Security** — Force MFA for admins toggle. Session timeout config. Audit log viewer.
  6. **Danger zone** — Maintenance mode toggle (shows maintenance page to all users). Clear cache button.
- **Components needed:** CourierConfigList, AuditLogViewer, MaintenanceModeToggle

---

## SECTION 9 — SUMMARY TABLES

### 9.1 — Design Status by Portal

| Portal | Total Routes | Designed | Partial | Missing |
|--------|-------------|----------|---------|---------|
| Public/Marketing | 1 | 0 | 1 | 0 |
| Customer | 13 | 0 | 3 | 10 |
| Driver | 7 | 0 | 1 | 6 |
| Dispatch | 5 | 0 | 1 | 4 |
| Warehouse | 6 | 0 | 1 | 5 |
| Customs | 5 | 0 | 1 | 4 |
| Agent | 6 | 0 | 1 | 5 |
| Admin | 14 | 1 | 3 | 10 |
| **TOTAL** | **57** | **1** | **12** | **44** |

### 9.2 — Pages by Archetype

| Archetype | Count | Portals |
|-----------|-------|---------|
| `TABLE` / `DRAWER` | 19 | All |
| `SETTINGS` | 8 | Customer, Driver, Customs, Agent, Admin |
| `DASH` | 6 | Customer, Driver, Warehouse, Agent, Admin ×2 |
| `REPORT` | 6 | Driver, Warehouse, Customs, Agent, Admin ×2 |
| `AUTH` | 3 | Customer |
| `MAP` | 3 | Dispatch, Admin |
| `DETAIL` | 3 | Customer ×2, Driver |
| `WIZARD` | 1 | Customer |
| `SEARCH` | 3 | Customer ×2, Warehouse |
| Custom | 4 | Homepage, Wallet, Broadcast, Receive |

### 9.3 — Build Priority Order (from propose-design.md Phase plan)

**Phase 2 — Customer-facing (complete end-to-end journey first):**
1. `/` — homepage
2. `/customer/auth/login`
3. `/customer/auth/register`
4. `/customer/auth/forgot-password`
5. `/customer/dashboard`
6. `/customer/shipments`
7. `/customer/shipments/new`
8. `/customer/shipments/[id]`
9. `/customer/track`
10. `/customer/track/[trackingNumber]`
11. `/customer/wallet`
12. `/customer/addresses`
13. `/customer/documents`
14. `/customer/settings`

**Phase 3 — Operations (real-time flows):**
15. `/driver/home`
16. `/driver/jobs/queue`
17. `/driver/jobs/[id]`
18. `/driver/earnings`
19. `/driver/profile`
20. `/driver/settings`
21. `/dispatch` (map)
22. `/dispatch/shipments`
23. `/dispatch/routes`
24. `/dispatch/fleet`
25. `/dispatch/broadcast`
26. `/warehouse`
27. `/warehouse/receive`
28. `/warehouse/inventory`
29. `/warehouse/dispatch`
30. `/warehouse/search`
31. `/warehouse/reports`

**Phase 4 — Back-office (control and management):**
32. `/admin/shipments`
33. `/admin/users`
34. `/admin/kyc`
35. `/admin/drivers`
36. `/admin/vehicles`
37. `/admin/map`
38. `/admin/warehouse`
39. `/admin/customs`
40. `/admin/branches`
41. `/admin/billing`
42. `/admin/support`
43. `/admin/analytics`
44. `/admin/settings`
45. `/customs/shipments`
46. `/customs/documents`
47. `/customs/reports`
48. `/customs/settings`
49. `/agent/shipments`
50. `/agent/customers`
51. `/agent/drivers`
52. `/agent/reports`
53. `/agent/settings`

---

## SECTION 10 — SHARED COMPONENT REQUIREMENTS SUMMARY

Components needed across multiple portals (build once, use everywhere):

| Component | Used In | Priority |
|-----------|---------|----------|
| `DataTable` | All portals | P0 |
| `StatusBadge` (all 18 statuses) | All portals | P0 |
| `KpiCard` | Customer, Driver, Warehouse, Agent, Admin | P0 |
| `FilterBar` | All TABLE pages | P0 |
| `EmptyState` | All portals | P0 |
| `SkeletonRow` | All TABLE pages | P0 |
| `TrackingTimeline` | Customer, Admin | P0 |
| `AddressForm` (+ Google autocomplete) | Customer (wizard + addresses) | P0 |
| `DocumentUploadModal` | Customer, Customs, Admin KYC | P1 |
| `AIConfidenceBadge` | Customer documents, Customs | P1 |
| `ShipmentCard` | Customer dashboard + list | P1 |
| `WalletCard` | Customer wallet + dashboard | P1 |
| `OTPInput` (6-box) | Auth flows | P1 |
| `PasswordStrengthBar` | Auth register + settings | P1 |
| `PhotoCapture` | Driver POD, Warehouse receive | P1 |
| `SignaturePad` | Driver POD | P1 |
| `MapEmbed` (Google Maps) | Dispatch, Driver, Admin | P1 |
| `RightDrawer` (slide-in panel) | All DRAWER pages | P1 |
| `BroadcastComposer` | Dispatch only | P2 |
| `CapacityGauge` | Warehouse | P2 |
| `RouteBuilder` | Dispatch routes | P2 |

---

*PAGE INVENTORY.md — DiasporaShip v1.0*
*57 design obligations · 10 portals · 11 archetypes*
*Next document: PAGE_ARCHETYPES.md*