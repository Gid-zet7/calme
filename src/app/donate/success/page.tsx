import DonateSuccessClient from './DonateSuccessClient';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

const DonateSuccessPage = () => {
  return <DonateSuccessClient />;
};

export default DonateSuccessPage;
