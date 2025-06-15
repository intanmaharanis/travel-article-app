import { Facebook, Instagram, Share2 } from 'lucide-react';

interface UserSocialShareProps {
  username: string;
  description: string;
  onShareClick?: () => void;
  onShareFacebook?: () => void;
  onShareInstagram?: () => void;
}

const getRandomDescription = (): string => {
  const descriptions = [
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui. Sint occaecat cupidatat non proident, sunt in culpa qui.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const getInitialAvatar = (name: string) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-purple-500 text-white text-4xl font-bold flex-shrink-0">
      {initial}
    </div>
  );
};

export default function UserSocialShare({
  username,
  description,
  onShareClick,
  onShareFacebook,
  onShareInstagram,
}: UserSocialShareProps) {
  const displayDescription = description || getRandomDescription();

  return (
    <div className="rounded-xl p-6 mb-8 flex items-center bg-lime-100 mt-20 max-w-5xl">
      <div className="mr-6">
        {getInitialAvatar(username)}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">{username}</h2>
        <p className="text-gray-700 mb-4">{displayDescription}</p>
        <div className="flex space-x-3">
          
          {onShareInstagram && (
            <button
              onClick={onShareInstagram}
              className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Share on Instagram"
            >
              <Instagram size={16} />
            </button>
          )}
          {onShareFacebook && (
            <button
              onClick={onShareFacebook}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Share on Facebook"
            >
              <Facebook size={16} />
            </button>
          )}
          {onShareClick && (
            <button
              onClick={onShareClick}
              className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Share using native share"
            >
              <Share2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 