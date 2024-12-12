import { z } from 'zod';

// UI configuration schema
export const UIConfigSchema = z.object({
  branding: z.object({
    logo: z.object({
      light: z.string(),
      dark: z.string(),
    }),
    header: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
    }),
    footer: z.object({
      text: z.string(),
      links: z.array(z.object({
        label: z.string(),
        url: z.string(),
      })),
      contact: z.object({
        email: z.string(),
        phone: z.string(),
      }),
    }),
  }),
});

export type UIConfig = z.infer<typeof UIConfigSchema>;

// UI configurations loaded from YAML
export const UI_CONFIG: UIConfig = {
  "branding": {
    "logo": {
      "light": "/app/assets/logo-light.svg",
      "dark": "/app/assets/logo-dark.svg"
    },
    "header": {
      "title": "Network Monitor",
      "subtitle": "Network Diagnostic Tool"
    },
    "footer": {
      "text": "\u00a9 2024 Network Monitor. All rights reserved.",
      "links": [
        {
          "label": "Privacy Policy",
          "url": "/privacy"
        },
        {
          "label": "Terms of Service",
          "url": "/terms"
        }
      ],
      "contact": {
        "email": "support@example.com",
        "phone": "+1 (555) 123-4567"
      }
    }
  }
};