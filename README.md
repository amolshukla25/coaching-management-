# MAAC Institute Management Portal

A comprehensive institute management system built with Next.js, Tailwind CSS, and Framer Motion.

## Features

### Role-Based Access Control
- **Admin**: Full access to all features
- **Teacher**: Manage batches, mark attendance, create lesson plans
- **Student**: View attendance, lesson plans, and progress
- **Academic Manager**: Monitor teacher performance, batch progress
- **Account Manager**: Financial overview, fee tracking

### Core Features

#### Dashboard
- Role-specific dashboards with real-time statistics
- Interactive charts and graphs (using Recharts)
- Activity feeds and notifications
- Quick actions and shortcuts

#### Batch Management
- Create, edit, and delete batches
- Assign teachers to batches
- Track enrollment capacity
- Schedule management

#### Attendance System
- Date-wise attendance tracking
- Quick mark feature for teachers
- Attendance history and reports
- Export functionality

#### Lesson Plans
- Create and manage lesson plans
- Schedule classes and topics
- Track completion status
- Materials and resources management

#### Finance
- Fee collection tracking
- Payment history
- Overdue alerts
- Export reports

#### Students & Teachers
- Student profiles with progress tracking
- Teacher workload management
- Performance metrics

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd maac-institute

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Credentials

Use the quick login buttons on the login page:

| Role | Email |
|------|-------|
| Admin | admin@maac.com |
| Teacher | rahul@maac.com |
| Student | amit@student.com |
| Academic Manager | academic@maac.com |
| Account Manager | account@maac.com |

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── login/
│   ├── dashboard/
│   │   ├── admin/
│   │   ├── teacher/
│   │   ├── student/
│   │   ├── academic-manager/
│   │   └── account-manager/
│   ├── batches/
│   ├── attendance/
│   ├── lesson-plans/
│   ├── students/
│   ├── teachers/
│   ├── finance/
│   └── settings/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   └── layout/
│       ├── Layout.tsx
│       ├── Sidebar.tsx
│       └── Header.tsx
├── lib/
│   └── mockData.ts
├── store/
│   └── useStore.ts
└── types/
    └── index.ts
```

## UI Features

- **Modern Design**: Glassmorphism effects, gradients, and blur
- **Responsive**: Works on desktop, tablet, and mobile
- **Animations**: Smooth transitions and micro-interactions
- **Dark Mode Ready**: Toggle support in settings
- **Accessible**: Proper ARIA labels and keyboard navigation

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## License

MIT License - Free to use for educational purposes
