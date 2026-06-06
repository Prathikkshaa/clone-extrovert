// Domain enums shared across all apps.
// WHY: these values are stable (defined in master-context §5/§6) and are used by
// the DB layer, API DTOs, and the UI. Defining them once prevents drift.

/** Lifecycle of a lead in the sales pipeline. (`leads.status`) */
export enum LeadStatus {
  New = 'new',
  Contacted = 'contacted',
  Replied = 'replied',
  Meeting = 'meeting',
  Won = 'won',
  Lost = 'lost',
}

/** Enrichment progress for a lead. (`leads.enrichment_status`) */
export enum EnrichmentStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Complete = 'complete',
  Failed = 'failed',
}

/** Delivery state of an outbound/threaded message. (`messages.state`) */
export enum MessageState {
  Queued = 'queued',
  Sent = 'sent',
  Bounced = 'bounced',
  Replied = 'replied',
  Stopped = 'stopped',
}

/** Sending mode for a user/campaign. (`users.mode`, `campaigns.mode`) */
export enum UserMode {
  Draft = 'draft',
  Autonomous = 'autonomous',
}

/** Connected mailbox provider. (`mailboxes.provider`) */
export enum MailboxProvider {
  Gmail = 'gmail',
  Outlook = 'outlook',
}

/** Outreach channel of a campaign. (`campaigns.channel`) */
export enum CampaignChannel {
  Email = 'email',
  WhatsApp = 'whatsapp',
}

/** Source of the applied brand theme. (`company_profiles.theme_source`) */
export enum ThemeSource {
  Fetched = 'fetched',
  Official = 'official',
}

/** Reason a credit-ledger entry was written. (`credit_ledger.reason`) */
export enum CreditReason {
  Purchase = 'purchase',
  Search = 'search',
  Enrichment = 'enrichment',
  Draft = 'draft',
  Send = 'send',
  Refund = 'refund',
}

/** Lifecycle of a metered usage event. (`usage_events.status`) */
export enum UsageStatus {
  Reserved = 'reserved',
  Committed = 'committed',
  Refunded = 'refunded',
}

/** Why an address was suppressed from sending. (`suppressions.reason`) */
export enum SuppressionReason {
  Unsubscribe = 'unsubscribe',
  Bounce = 'bounce',
  Manual = 'manual',
}
