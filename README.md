# HoloPass

A Web3-powered digital passport and event management platform that combines blockchain technology with seamless event experiences.

## Team Members

- **Sufiyan Sajan**
- **Ram Belitker**
- **Katin Patil**
- **Ashwin Mathur**

## Overview

HoloPass is a next-generation event management platform that leverages blockchain technology to create digital passports for attendees. The platform enables seamless event discovery, RSVP management, and check-in processes using QR codes and NFT-based credentials.

## Features

- **Digital Passport**: NFT-based digital identity for event attendees
- **Event Discovery**: Browse and discover upcoming events
- **QR Code Integration**: Quick check-in and verification system
- **Web3 Wallet Integration**: Connect with popular Web3 wallets
- **Real-time RSVP Management**: Track event attendance and RSVPs
- **Responsive Design**: Works seamlessly across all devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Blockchain**: Web3 integration for NFT passports
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Web3 wallet (MetaMask, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sidemen7z/holopass.git
cd holopass
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
holopass/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── events/            # Events pages
│   ├── passport/          # Digital passport page
│   └── scan/              # QR scanner page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── supabase/        # Supabase client setup
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
├── scripts/             # Database scripts
└── styles/              # Global styles
```

## Database Setup

Run the SQL scripts in order to set up your Supabase database:

1. `scripts/01-create-tables.sql` - Creates the necessary tables
2. `scripts/02-seed-data.sql` - Seeds initial data
3. `scripts/03-add-functions.sql` - Adds database functions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please reach out to the team members listed above.
