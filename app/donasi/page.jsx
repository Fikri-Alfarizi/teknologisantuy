import { redirect } from 'next/navigation';

export default function OldDonationsPage() {
  redirect('/donasi');
  return null;
}
