export type AlertType =
  | "risk_of_failure"
  | "attendance"
  | "school_event"
  | "holiday"
  | "grades_published"
  | "general";

export type AlertStatus = "draft" | "scheduled" | "sent" | "failed";

export type NotificationChannel = "email" | "sms" | "both";

export interface Alert {
  id: number;
  title: string;
  message: string;
  alert_type: AlertType;
  status: AlertStatus;
  channel: NotificationChannel;
  target_recipients: string[];
  created_by: string;
  created_at: string; 
  scheduled_at: string;
  sent_at?: string;
  extra_data?: Record<string, any>;
}
