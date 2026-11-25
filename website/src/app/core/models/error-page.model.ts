export interface ErrorPageContent {
  code: number;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
}

export type ErrorPageMessages = Partial<Record<number, Partial<Omit<ErrorPageContent, 'code'>>>>;

export interface ErrorPageRouteConfig {
  homeUrl?: string;
  homeLabel?: string;
  messages?: ErrorPageMessages;
}
