import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ReturnButtonProps {
  href: string;
  label: string;
}

const ReturnButton = ({ href, label }: ReturnButtonProps) => {
  return (
    <Button asChild size={'sm'} className='mb-4'>
      <Link href={href}>
        <ArrowLeftIcon /> {label}
      </Link>
    </Button>
  );
};
export default ReturnButton;
