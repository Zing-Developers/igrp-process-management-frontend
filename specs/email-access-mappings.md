# Email Access Mappings Management

**SPEC STATUS: READY FOR APPROVAL**

## 1. Objective

Add an authenticated page at `/email-access-mappings` where authorized administrators can list, create, edit, and revoke the email-to-permission mappings used by external systems calling the Process Management API with their own Keycloak token. The page must preserve the structure and flow of the supplied “Consola de Acessos por Email” reference while fitting the existing application shell and the conventions of the API-key management page.

## 2. Context

- The visual and behavioral reference is `_resources/Consola de Acessos por Email.htm`; the rendered application is embedded in `_resources/Consola de Acessos por Email_files/saved_resource.html`.
- The related implementation precedent is `src/app/(igrp)/(generated)/api-keys/page.tsx` and its server-action integration in `src/app/(myapp)/functions/m2m-keys.ts`.
- `@irn/platform-process-management-client-ts` version `0.1.0-beta.23` exposes the required operations through `ProcessManagementClient.emailAccessMappings`:
  - `getEmailAccessMappings()`
  - `createEmailAccessMapping(body)`
  - `updateEmailAccessMapping(id, body)`
  - `revokeEmailAccessMapping(id)`
- The package's `EmailAccessMapping` response contract provides mapping identity, email, permissions, description, notes, active and expiration state, revocation metadata, and standard create/update audit metadata. The create/update request contract provides email, permissions, description, notes, and expiration.
- The configured client targets Process Management only. Process Studio is not available through this client.
- No repository source currently provides a dynamic permission catalogue or client-side `EMAIL_ACCESS_MAPPINGS:*` capability model. The API remains the authorization authority.
- The page must use the project's existing application shell, design-system components, query/mutation conventions, API client configuration, toast behavior, access-denied component, loading treatment, and user/audit presentation where applicable. It must not recreate the standalone reference's global top bar or custom theme.
- `useIGRPToast` emits events only; an `IGRPToaster` must be mounted in the root application layout for those events to be visible.

## 3. Confirmed Decisions

1. The page manages Process Management mappings only.
2. The Process Management/Process Studio selector and the “Backend” summary card from the reference are omitted.
3. The reference's Process Management permission catalogue is provided as static quick-add suggestions, while valid free-form permission entry remains supported.
4. Authorization is enforced by the API. A list request rejected with 401 or 403 produces the application's access-denied page; all other API failures, including rejected create, edit, or revoke operations, display the API-provided error message in a Toast.
5. Each table row initially displays at most three permission chips. Rows with additional permissions provide an inline control for expanding and collapsing the complete permission list.
6. Expiration date selection uses `IGRPDatePickerSingle` with the companion `IGRPInputTime` control, preserving the API's local date-and-time contract.
7. Descriptions are displayed inline using a 46-character preview. Longer descriptions are truncated with `...` and can be expanded and collapsed within their row; notes remain hidden behind their existing discoverable indicator/tooltip.

## 4. Scope

### In Scope

- A client-rendered page reachable directly at `/email-access-mappings` within the existing generated application layout.
- Server-side wrappers around all four email-access-mapping client operations.
- Loading, populated, empty, denied, and error states.
- Summary counts for active, expiring, and revoked mappings.
- A mapping table with state, expiration, audit information, and row actions.
- Create and edit dialogs with email, permissions, description, notes, and expiration fields.
- Static permission suggestions plus free-form permission entry and validation.
- Irreversible revocation with explicit confirmation.
- List refresh and success/error feedback after mutations.
- Responsive and keyboard-accessible behavior consistent with the project design system.
- Build, static-analysis, and manual verification of the mapping rules and primary management flows using the repository's current tooling.

### Out of Scope

- Process Studio mappings or any backend switcher.
- A dynamic permission-catalogue API or catalogue administration.
- Changes to the backend, generated client package, or shared types package.
- Restoring or reactivating a revoked mapping.
- Deleting revoked mappings from history.
- Changing a mapping's email after creation.
- Search, filtering, sorting controls, pagination, or bulk actions.
- Adding or changing global navigation entries unless route discovery in the existing application requires it for the route to function.
- Recreating the reference's standalone administration/session header or its bespoke CSS theme.

## 5. Business Rules

### Mapping state

- A mapping whose `active` value is explicitly `false` is **Revogado**.
- A non-revoked mapping whose `expiresAt` is at or before the current local date and time is **Expirado**.
- Every other non-revoked mapping is **Activo**.
- Revoked state takes precedence over expiration state.
- An expired mapping remains editable and revocable.
- A revoked mapping remains visible but cannot be edited or revoked again.

### Summary counts

- **Activos** counts mappings currently in the Active state.
- **A expirar em 30 dias** counts Active mappings with an expiration after the current time and no later than 30 days from the current time.
- **Revogados** counts mappings whose `active` value is explicitly `false`.
- Expired mappings are not included in any of these three counts.

### Email

- Email is required when creating a mapping and must be syntactically valid.
- Before creation, leading/trailing whitespace is removed and the email is normalized to lowercase.
- Email is displayed as read-only when editing and must remain unchanged by an update.
- Duplicate-active-email decisions remain authoritative on the backend; its validation message must be surfaced to the user.

### Permissions

- At least one permission is required.
- Each permission must match `^[A-Z0-9_.]+:[a-z_]+$`, representing `MODULE:action`.
- Values beginning with `ROLE_` or `GROUP_` are rejected even if they otherwise match the pattern.
- Duplicate permissions are not added.
- The page provides these static quick-add suggestions:
  - `AREAS:visualizar`
  - `PROCESS_DEFINITIONS:visualizar`
  - `PROCESS_DEFINITIONS:publicar`
  - `PROCESS_INSTANCES:visualizar`
  - `PROCESS_INSTANCES:criar`
  - `TASK_INSTANCES:visualizar`
  - `TASK_INSTANCES:criar`
  - `TASK_INSTANCES:pesquisar_todos`
- The suggestion list is non-exhaustive; any free-form value satisfying the validation rules is accepted by the UI.

### Optional fields and expiration

- Description and notes are optional free-text values.
- Notes are administrative context only and do not participate in access decisions.
- Expiration is optional and is entered with `IGRPDatePickerSingle` for the date and `IGRPInputTime` for the time.
- When supplied, expiration is sent as a `LocalDateTime`-style string without a timezone offset, consistent with the reference and platform API contract.
- Clearing description, notes, or expiration during editing must omit that optional property from the PUT request and must clear the value on the saved mapping, as expected from the current full-replacement PUT contract.
- The frontend does not introduce a future-only expiration rule that is absent from the reference. Backend validation errors remain authoritative.

### Revocation

- Revocation is irreversible from this page and takes effect for the external system's next request.
- The mapping remains in the list with its revocation audit information.
- Restoring access requires creation of a new mapping.

## 6. User and System Flows

### Load and review mappings

1. The user opens `/email-access-mappings`.
2. The page requests mappings through the server-side wrapper and displays a loading state.
3. On success, it calculates summary values and renders all returned mappings.
4. When no mappings exist, the table area displays the empty-state message.
5. If the list request returns 401 or 403, the normal content is replaced by the application's access-denied page.
6. Other failures display the API-provided error message in an error Toast, retain the in-page error as persistent feedback, and allow the normal query retry behavior supported by the application.

### Create a mapping

1. The user selects **Novo mapeamento**.
2. A dialog opens with blank email, permissions, description, notes, and expiration fields.
3. The user adds permissions from the suggestions or through the free-form chip input.
4. Client validation runs on submission.
5. A valid form is normalized and sent through `createEmailAccessMapping`.
6. On success, the dialog closes, the list is refreshed, and a success toast identifies the email.
7. On failure, the dialog remains available and the API-provided error message is shown in a Toast without discarding entered values.

### Edit a mapping

1. The user selects **Editar** on a mapping that is not revoked.
2. The same form dialog opens populated with current values; email is read-only.
3. The user can replace the permission set and change or clear description, notes, and expiration.
4. A valid form is sent through `updateEmailAccessMapping` using the mapping ID.
5. On success, the dialog closes, the list is refreshed, and a success toast is shown.
6. On failure, the dialog remains available and the API-provided error message is shown in a Toast without discarding changes.

### Revoke a mapping

1. The user selects **Revogar** on a mapping that is not revoked.
2. A destructive confirmation identifies the email and explains that the next request will be rejected, the action cannot be undone, and the audit record remains.
3. Cancel closes the confirmation without calling the API.
4. Confirm calls `revokeEmailAccessMapping` once using the mapping ID and disables repeated submission while pending.
5. On success, the confirmation closes, the list is refreshed, and a success toast identifies the email.
6. On failure, the mapping remains unchanged in the current view and the API-provided error message is shown in a Toast.

## 7. Functional Requirements

**FR-01** The application shall expose the management page at `/email-access-mappings` inside the existing authenticated application layout.

**FR-02** The page shall call the installed `@irn/platform-process-management-client-ts` through server-side functions and the existing `getIGRPProcessClient()` configuration; browser code shall not construct a separate API client or handle access tokens directly.

**FR-03** The server-side functions shall wrap list, create, update, and revoke operations in the same discriminated success/error result pattern used by the API-key feature, preserving HTTP status and the backend error text from `details.error`, `details.message`, `details.detail`, or a non-empty string response, in that order when available.

**FR-04** The page header shall use the existing application component pattern, display **Mapeamentos de acesso por email**, explain how Keycloak service-account emails receive mapped permissions, and show the total returned mapping count.

**FR-05** The content shall provide a primary **Novo mapeamento** action and three summary cards: **Activos**, **A expirar em 30 dias**, and **Revogados**.

**FR-06** The page shall not display a backend selector or a Process Studio option.

**FR-07** The mapping table shall display Email, Permissões, Estado, Expira, Criado, Última alteração, and Ações columns.

**FR-08** An email cell shall show the email prominently and description as secondary text when present. It shall display the first 46 characters of a description inline. A longer description shall append `...` and provide an accessible **Ver descrição completa** control that reveals the full description and changes to **Ver menos** for collapsing it again. Descriptions of 46 characters or fewer shall display in full without an expansion control. When notes are present, their content remains hidden behind a discoverable notes indicator/tooltip.

**FR-09** Permissions shall be displayed as individual chips. Each row shall initially show no more than the first three permissions; when more exist, a link-style **Ver todos** button shall reveal every permission in that row and change to **Ver menos** so the row can be collapsed again. The control shall expose its expanded state accessibly. Status shall be displayed as a visually distinct Active, Expired, or Revoked pill.

**FR-10** Expiration shall display the platform's Portuguese local date/time representation or **sem expiração** when absent.

**FR-11** Create and update audit cells shall show the applicable date/time and resolved user profile. If a resolved profile is absent, the raw `createdBy` or `updatedBy` value shall be used; absent values shall degrade without breaking the row.

**FR-12** A revoked row shall also show the revocation date and resolved revoking user, falling back to raw `revokedBy`, and shall visually communicate that the row is inactive.

**FR-13** The create/edit dialog shall implement all Email, Permissions, Description, Notes, and Expiration rules defined in this specification and shall change its title, explanatory text, submit label, and email editability according to mode. Its optional date field shall use `IGRPDatePickerSingle` with `id="mapping-expires-date"`, `name="mappingExpiresDate"`, label **Data de expiração**, `dd/MM/yyyy` format, and helper text **Opcional**. Its companion `IGRPInputTime` shall use `id="mapping-expires-time"`, `name="mappingExpiresTime"`, and label **Hora de expiração**. A selected date and time complete the local date-time sent to the API.

**FR-14** Permission entry shall support quick-add suggestions and removable chips. Free-form input shall add a valid permission on Enter or comma; duplicate values shall be ignored. Invalid values shall display a field/form error and shall not be added.

**FR-15** Closing or cancelling a create dialog shall reset its values and validation errors. Cancelling an edit shall not mutate the displayed mapping.

**FR-16** Submission controls and dialog dismissal paths that could duplicate or interrupt a request shall be disabled while the corresponding mutation is pending.

**FR-17** After each successful mutation, cached mapping data shall be invalidated or refetched before updated data is presented as authoritative.

**FR-18** The page shall show a dedicated empty state reading **Ainda não há mapeamentos neste backend.** when the successful list is empty.

**FR-19** A 401 or 403 list response shall render `AccessDeniedPage` with status-appropriate Portuguese guidance. Every other list failure and every mutation failure, including 401/403 mutation responses, shall display the API-provided error text in an error Toast without silently changing local data. A list error Toast shall be shown at most once per unchanged error response.

**FR-20** The table shall remain usable on narrow viewports through horizontal overflow, while dialogs and actions shall remain operable by keyboard and expose accessible labels, focus behavior, validation messages, and destructive-action semantics.

**FR-21** The root application layout shall mount exactly one `IGRPToaster` so all error and success Toast events emitted by the page can be rendered.

## 8. Data and API Contracts

| UI operation | Client method | Required request behavior | Success behavior |
|---|---|---|---|
| List | `getEmailAccessMappings()` | No request body | Use returned `EmailAccessMapping[]` as the authoritative list |
| Create | `createEmailAccessMapping(body)` | Lowercase normalized email, at least one validated permission, optional description/notes/expiration | Refresh list and report success |
| Edit | `updateEmailAccessMapping(id, body)` | Existing ID; email remains unchanged; send the complete desired permission set, include populated optional fields, and omit cleared optional fields | Refresh list and report success |
| Revoke | `revokeEmailAccessMapping(id)` | Existing ID; no body | Refresh list and report success |

The UI must tolerate optional response fields. A missing optional value must render an appropriate fallback rather than throw or suppress the rest of the list.

## 9. Edge Cases and Failure Behavior

- A mapping with both `active: false` and a past expiration renders as Revoked.
- A mapping with a past expiration but not explicitly revoked renders as Expired and retains enabled Edit and Revoke actions.
- A mapping without an ID can still be displayed, but mutation actions requiring an ID are disabled.
- Repeated entry of an existing permission does not create duplicate chips.
- Empty permission input does nothing and is not treated as a permission.
- Invalid email, missing permissions, role/group permission values, and malformed permission values block submission locally.
- Backend validation, conflict, and duplicate-email messages are surfaced from `details.error` when supplied.
- Transport or unexpected failures use a generic Portuguese retry message.
- Failed mutations do not optimistically alter counts, rows, or statuses.
- Missing audit profiles fall back to raw audit identifiers; missing identifiers render a neutral unavailable state.
- A successful response with an empty array is an empty state, not an error.

## 10. Technical Impact

### Frontend

- Add the Next.js page under the route segment corresponding to `/email-access-mappings`.
- Reuse the existing `PageHeader`, `AccessDeniedPage`, `IgrpLoading`, `UserCell`, IGRP form/dialog/button components, and React Query patterns where they satisfy the specified behavior.
- Adapt the reference's information hierarchy and interaction flow to application-native components rather than copying its standalone markup and CSS.

### API integration

- Add server-side email-access-mapping functions alongside the project's existing function modules.
- Obtain the client through `getIGRPProcessClient()` and call `client.emailAccessMappings` methods.
- Keep authentication, gateway headers, timeout, and token refresh behavior centralized in the existing API client configuration.

### Data and persistence

- No local persistence, schema change, migration, or optimistic source of truth is introduced.
- All persisted state and audit metadata come from the Process Management API.

## 11. Dependencies and Contract Constraints

- Successful implementation depends on the live PUT endpoint applying full-replacement semantics: omitted optional `description`, `notes`, and `expiresAt` properties must clear their stored values.
- The installed `EmailAccessMappingRequest` type does not permit explicit `null`. If the live API requires `null` rather than omission to clear a value, that is a backend/shared-contract mismatch and must be corrected outside this frontend feature before the clearing acceptance criterion can pass.
- No dynamic permission catalogue is available; the approved static suggestion list is intentionally frontend-owned.

## 12. Testing Expectations

- The repository currently has no automated test runner or test script. Introducing a test framework is outside this feature's scope.
- Static verification shall include a production Next.js build/type check and a non-mutating Biome check of affected files.
- Manual verification using mocked or development API responses shall cover:
  - email normalization, permission validation, role/group rejection, duplicate suppression, state precedence, and all three summary calculations including the 30-day boundary;
  - loading, populated, and empty list states;
  - 401/403 list handling;
  - create validation and successful request normalization;
  - edit initialization, immutable email, optional-field clearing, and update payload;
  - revoke cancellation, single confirmed request, disabled revoked-row actions, and refresh after success;
  - backend error-message presentation without loss of form values.
- If an automated frontend test harness is added to the repository before implementation begins, the rules and flows above should receive automated coverage at the supported unit/component layer, mocking the server-function boundary rather than making live API calls.

## 13. Acceptance Criteria

**AC-01**

- Given an authenticated user whose list request is authorized
- When the user opens `/email-access-mappings`
- Then the page loads mappings through `client.emailAccessMappings.getEmailAccessMappings()` and renders inside the existing application shell.

**AC-02**

- Given a returned list containing active, soon-expiring, expired, and revoked mappings
- When the list renders
- Then the three summary cards follow the state and 30-day counting rules in this specification and the header badge shows the total number of mappings.

**AC-03**

- Given a populated mapping
- When its row renders
- Then email, optional description/notes indicator, permission chips, state, expiration, creation audit, last-change audit, and permitted actions are available in the specified table structure.

**AC-04**

- Given a successful list response containing no mappings
- When loading completes
- Then the page shows **Ainda não há mapeamentos neste backend.** and does not treat the result as an error.

**AC-05**

- Given a list request returning 401 or 403
- When the response is handled
- Then the mapping content is replaced by the application's access-denied page with status-appropriate guidance.

**AC-06**

- Given the create dialog
- When the user enters a mixed-case email with surrounding whitespace, at least one valid permission, and optional details and submits
- Then the create request contains the trimmed lowercase email, desired unique permissions, and correctly represented optional values.

**AC-07**

- Given a permission value that is malformed, begins with `ROLE_` or `GROUP_`, or a form with no permissions
- When the user attempts to add or submit it
- Then the UI presents an actionable validation error and does not send a mutation request.

**AC-08**

- Given either a static suggestion or a valid free-form `MODULE:action` value
- When the user adds it
- Then it appears once as a removable permission chip.

**AC-09**

- Given a non-revoked mapping
- When the user opens Edit
- Then the form is populated, email is read-only, and permissions, description, notes, and expiration can be changed or cleared.

**AC-10**

- Given valid edited values
- When the update succeeds
- Then the dialog closes, the authoritative list is refreshed, and a success toast is shown.

**AC-11**

- Given an expired but non-revoked mapping
- When its row renders
- Then its state is Expired and its Edit and Revoke actions remain enabled when an ID is present.

**AC-12**

- Given a user who selects Revoke
- When the confirmation opens
- Then it identifies the mapping email and states the immediate, irreversible effect and retained audit record.

**AC-13**

- Given an open revoke confirmation
- When the user cancels
- Then no API request occurs and the displayed mapping remains unchanged.

**AC-14**

- Given an open revoke confirmation
- When the user confirms and the API succeeds
- Then exactly one revoke request is sent, the list is refreshed, the row becomes Revoked from API data, its actions are disabled, and a success toast identifies the email.

**AC-15**

- Given a create, update, or revoke API failure with a backend `error` detail
- When the response is handled
- Then that backend message is shown and no unconfirmed local state change is presented.

**AC-16**

- Given a revoked mapping
- When the table renders
- Then the mapping remains visible, shows revocation audit information, and cannot be edited or revoked again.

**AC-17**

- Given a narrow viewport or keyboard-only interaction
- When the user reviews the table and operates dialogs
- Then content remains reachable, focus is visible and correctly managed, validation is programmatically exposed, and all actions have accessible names.

**AC-18**

- Given a mapping containing more than three permissions
- When its row first renders
- Then only its first three permission chips and a **Ver todos** link-style button are visible.
- When the user activates **Ver todos**
- Then all permissions in that row are displayed, the control reports an expanded state, and its label changes to **Ver menos**.
- When the user activates **Ver menos**
- Then the row returns to its three-permission summary.

**AC-19**

- Given the create or edit mapping dialog
- When the expiration controls render
- Then the date is selected through `IGRPDatePickerSingle` using `dd/MM/yyyy`, the time is entered through `IGRPInputTime`, and the date picker is disabled while a save is pending.
- When the user saves a selected date and valid time
- Then the request contains their combined local date-time value without a timezone offset.

**AC-20**

- Given a description containing 46 characters or fewer
- When its mapping row renders
- Then the complete description is displayed without an expansion control.
- Given a description containing more than 46 characters
- When its mapping row first renders
- Then only the first 46 characters followed by `...` and **Ver descrição completa** are displayed.
- When the user activates **Ver descrição completa**
- Then the full description is displayed and the control changes to **Ver menos**, which restores the preview when activated.
- Given a mapping with notes
- When its row renders
- Then the note text is not displayed inline and remains available through the notes indicator/tooltip.

**AC-21**

- Given any create, update, revoke, or non-access list request that fails with an API error payload containing `error`, `message`, `detail`, or a string body
- When the response is handled
- Then the first available API-provided error text is displayed in an error Toast.
- Given an unchanged failed list response
- When the page re-renders
- Then it does not create duplicate error Toasts.
- Given a mapping API failure
- When the page emits its error Toast
- Then the root-mounted `IGRPToaster` renders it visibly to the user.

## 14. Definition of Done

- [ ] `/email-access-mappings` is reachable within the existing authenticated layout and contains no Process Studio/backend switcher.
- [ ] All four operations use `@irn/platform-process-management-client-ts` through `getIGRPProcessClient()` and server-side wrappers.
- [ ] The page implements the reference-derived header, three summary cards, mapping table, create/edit dialog, revoke confirmation, and feedback states using application-native components.
- [ ] Every functional requirement FR-01 through FR-21 is satisfied.
- [ ] Every acceptance criterion AC-01 through AC-21 passes documented manual verification and any applicable automated tests available at implementation time.
- [ ] Exactly one `IGRPToaster` is mounted by the root layout.
- [ ] Mapping, form, and API request code uses the package's exported types without duplicating incompatible local API models.
- [ ] The production build/type check and non-mutating Biome check pass for all affected files without introducing new warnings or suppressions.
- [ ] Manual verification covers every case listed in Testing Expectations, including optional-field clearing against the actual PUT behavior.
- [ ] No backend, database, shared-types package, client-package, Process Studio, or unrelated navigation behavior is changed.
- [ ] The page is verified in both supported light and dark themes and at desktop and narrow viewport widths.

## 15. Remaining Assumptions

- Existing project-level query retry defaults remain acceptable; this feature does not add custom retry or idempotency behavior.
