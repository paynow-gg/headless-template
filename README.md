# PayNow.gg - Headless API Example

An integration of the PayNow.gg Headless API built with Create T3 App, Next.js 15 and React 19 for kickstarting your next store design.

## Features

- 🛒 Complete e-commerce store template
- 🎨 Fully customizable theming system
- 🔐 PayNow.gg Steam & Minecraft API Integration
- 🛡️ Built-In PayNow.js Integration
- 🧩 Built-in support for PayNow Template Modules
- ⚡ Built with Next.js v15 & React v19
- 📱 Mobile responsive design
- 🚀 Ready for production deployment
- ✨ A marvellous user experience

## Demo

You can view a demo of this repository [here](https://headless-template.paynow.gg/)

## Prerequisites

- Node.js 20+ 
- pnpm
- A PayNow.gg account for API access

## Setup

This project uses [pnpm](https://pnpm.io/)

```bash
pnpm install
```

### Environment

Create your .env file with the following command

```bash
cp .env.example .env
```

Then make sure to fill in your environment variables.

### Getting your API Key

Head to the [Roles](https://dashboard.paynow.gg/roles) page of your PayNow Dashboard and create a new role with the following permissions:

- View Store
- View Customers
- Create Customers
- Update Customers
- View Giftcards

After doing so, head to the [API Keys](https://dashboard.paynow.gg/api-keys) page on the dashboard and create an API Key with the assigned role.

The API Key provided is your `PAYNOW_API_KEY` environment variable.

### Running the Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Theming

The website's color scheme is fully configurable by editing the CSS file located at `/src/styles/globals.css`

```css
:root {
  --radius: 0.65rem;

  --background: #09090b;
  --background-secondary: #8e51ff;

  --foreground: #fafafa;
  --border: rgba(255, 255, 255, 0.1);
  --input: rgba(255, 255, 255, 0.15);
  --ring: #7f22fe;

  --card: #18181b;
  --card-foreground: #fafafa;
  --popover: #18181b;
  --popover-foreground: #fafafa;

  --primary: #7f22fe;
  --primary-foreground: #f5f3ff;

  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #9f9fa9;
  --accent: #27272a;
  --accent-foreground: #fafafa;

  --destructive: #f53b3e;

  --chart-1: #1447e6;
  --chart-2: #00bc7d;
  --chart-3: #fe9a00;
  --chart-4: #ad46ff;
  --chart-5: #ff2056;

  --sidebar: #18181b;
  --sidebar-foreground: #fafafa;
  --sidebar-primary: #7f22fe;
  --sidebar-primary-foreground: #f5f3ff;
  --sidebar-accent: #27272a;
  --sidebar-accent-foreground: #fafafa;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #7f22fe;
}
```

## Deployment

This project can be deployed on various platforms. For detailed deployment instructions, see the [T3 Stack Deployment Guide](https://create.t3.gg/en/deployment).

### Quick Deploy Options:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Deploy directly from your repository

## Support

For support, questions, or more information, join our Discord community:

- [Discord](https://discord.com/invite/paynow)

## Contributing

Contributions are welcome! If you'd like to improve the template or suggest new features, please fork the repository, make your changes, and submit a pull request.

## Special thanks

[GameServerAnalytics.com](https://gameserveranalytics.com/) for providing the API for server metrics!