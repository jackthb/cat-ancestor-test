import { NextPage } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { types } from 'util';

interface NextDelivery {
  title: string;
  message: string;
  totalPrice: number;
  freeGift: boolean;
}

interface WelcomeProps {
  params: {
    userId: string;
  }
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/comms/your-next-delivery`

const fetchNextDelivery = async (userId: string): Promise<NextDelivery> => {
  const res = await fetch(
    `${BASE_URL}/${userId}`,
  );
  if (!res.ok) {
    throw new Error('Failed to fetch next delivery');
  }
  return res.json();
};

export default async function Welcome({ params }: WelcomeProps) {
  try {
    const data = await fetchNextDelivery(params.userId);

    if (!data) return notFound();

    const { title, message, totalPrice, freeGift: hasFreeGift } = data;

    return (
      <div className="relative md:m-8 my-12 mx-4">
        <MobileImage />
        <div className="rounded-md border-2 border-gray-300 flex justify-center bg-white">
          <DesktopImage />
          <ContentSection
            title={title}
            message={message}
            totalPrice={totalPrice}
          />
          {hasFreeGift && <FreeGiftBadge />}
        </div>
      </div>
    );
  } catch {
    return notFound();
  }
}

const MobileImage = () => (
  <Image
    src="/cat.webp"
    alt="The cutest cat ever"
    width={184}
    height={184}
    className="w-16 h-16 rounded-full absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 md:hidden block"
  />
);

const DesktopImage = () => (
  <Image
    src="/cat.webp"
    alt="The cutest cat ever"
    width={184}
    height={184}
    className="rounded-l-md basis-5/12 object-cover hidden md:block"
  />
);

interface ContentSectionProps {
  title: string;
  message: string;
  totalPrice: number;
}

const ContentSection = ({
  title,
  message,
  totalPrice,
}: ContentSectionProps) => (
  <div className="flex flex-col justify-center px-4 text-center md:text-start py-8 md:basis-7/12">
    <h1 className="text-2xl font-bold text-green-700 text-balance">{title}</h1>
    <p className="font-light text-gray-600 mt-2">{message}</p>
    <p className="font-bold text-gray-600 my-4">
      Total price: £{totalPrice.toFixed(2)}
    </p>
    <div className="flex justify-evenly w-full space-x-4 mt-4">
      <Button>See details</Button>
      <Button level="secondary">Edit delivery</Button>
    </div>
  </div>
);

const FreeGiftBadge = () => (
  <span className="absolute uppercase text-pink-900 font-bold bg-pink-300 md:rotate-6 px-4 border-2 border-pink-400 md:-top-2 md:-right-4 md:bottom-auto -bottom-4 -rotate-6">
    free gift
  </span>
);

interface ButtonProps {
  children: React.ReactNode;
  level?: 'primary' | 'secondary';
}

const Button = ({ children, level = 'primary' }: ButtonProps) => {
  const commonClasses =
    'rounded px-4 py-2 text-sm font-bold uppercase border-2 border-green-700 w-full transition-colors duration-200';
  const classNames =
    level === 'primary'
      ? 'bg-green-700 text-white hover:bg-green-800'
      : 'text-green-700 hover:bg-green-100';

  return (
    <button className={twMerge(commonClasses, classNames)}>{children}</button>
  );
};
