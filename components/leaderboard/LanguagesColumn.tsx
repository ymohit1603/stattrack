import React from 'react';
import { Code2 } from 'lucide-react';

interface Language {
  language: string;
  total_seconds: number;

}

interface LanguagesColumnProps {
  languages: Language[];
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Language colors mapping
const languageColors: { [key: string]: string } = {
  'Python': 'bg-[#3572A5] text-white',
  'JavaScript': 'bg-[#f7df1e] text-black',
  'TypeScript': 'bg-[#3178c6] text-white',
  'Java': 'bg-[#b07219] text-white',
  'C++': 'bg-[#f34b7d] text-white',
  'C#': 'bg-[#178600] text-white',
  'Go': 'bg-[#00ADD8] text-white',
  'Rust': 'bg-[#dea584] text-black',
  'Ruby': 'bg-[#701516] text-white',
  'PHP': 'bg-[#4F5D95] text-white',
  'Swift': 'bg-[#ffac45] text-black',
  'Kotlin': 'bg-[#F18E33] text-white',
  'HTML': 'bg-[#e34c26] text-white',
  'CSS': 'bg-[#563d7c] text-white',
  'Shell': 'bg-[#4EAA25] text-white',
  'default': 'bg-gray-500 text-white'
};

export const LanguagesColumn: React.FC<LanguagesColumnProps> = ({ languages }) => {
  if (!languages || languages.length === 0) {
    return (
      <div className="flex items-center text-muted-foreground">
        <Code2 className="h-4 w-4 mr-2" />
        <span>No data</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((lang, index) => (
        <div
          key={index}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            languageColors[lang.language] || languageColors.default
          }`}
        >
          {lang.language} {formatTime(lang.total_seconds)}
        </div>
      ))}
    </div>
  );
}; 