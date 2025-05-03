'use client';


import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface TownhallInfo {
  level: number;
  hoursCoded: number;
  nextLevelMinHours: number;
  hoursToNext: number;
}

interface CharacterInfo {
  name: string;
  image: string;
  slogan: string;
}

const getCharacterInfo = (level: number): CharacterInfo => {
  const characters: CharacterInfo[] = [

      {
        name: "Stannis Baratheon",
        image: "👨‍⚖️💻",
        slogan: "The night is dark and full of bug!"
      },
      {
        name: "Jon Snow",
        image: "🧑‍💻❄️",
        slogan: "If I fall, don't bring me back."
      },
      {
        name: "Sandor Clegane",
        image: "🔥🐶",
        slogan: "Remember Me? Yeah, You Do. You're Even Uglier Than I Am Now."
      },
      {
        name: "Jaime Lannister",
        image: "✋⚔️",
        slogan:"The code is full of bugs, Tommen. You can fix them, or laugh at them"
      },
      {
        name: "Robb Stark",
        image: "🐺👑",
        slogan: "How can I call myself a programmer If I can't center a div?"
      },
      {
        name: "Tywin Lannister",
        image: "📈🧠",
        slogan: "A Lannister always pays his debts."
      },
      {
        name: "Ned Stark",
        image: "☃️⚔️",
        slogan: "You vibe-coded it well when vibe-coding was safe."
      },
      {
        name: "Bronn",
        image: "💰🖥️",
        slogan: "Debugging is where our partnership ends. "
      },
      {
        name: "The Night King",
        image: "👻❄️",
        slogan: "I see dead pull requests."
      },
      {
        name: "Arya Stark",
        image: "🗡️🎯",
        slogan: "Leave one wolf alive and the sheep are never safe."
      },
      {
        name: "Jaqen H'ghar",
        image: "🎭⚔️",
        slogan: "Valar morghulis."
      }
  ];
  return characters[Math.min(level - 1, characters.length - 1)];
};

export function TownhallBadge({ townhall }: { townhall: TownhallInfo }) {
  const progress = (townhall.hoursCoded / townhall.nextLevelMinHours) * 100;
  const character = getCharacterInfo(townhall.level);
  const tooltipText = townhall.hoursToNext === 0
    ? `${character.name} (Max Level!)\n${character.slogan}`
    : `${character.name}\n${character.slogan}\nCoded: ${townhall.hoursCoded.toFixed(1)} hrs\nNeed: ${townhall.hoursToNext.toFixed(1)} hrs to Level ${townhall.level + 1}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center p-4 rounded-2xl shadow-md bg-card hover:shadow-lg transition-shadow cursor-pointer"
            aria-label={tooltipText}
          >
            <span className="text-4xl mb-2" role="img" aria-label={character.name}>
              {character.image}
            </span>
            <span className="text-sm font-medium mb-1">{character.name}</span>
            <span className="text-xs text-muted-foreground mb-1">{character.slogan}</span>
            <span className="text-xs font-medium mb-2">Level {townhall.level}</span>
            {townhall.hoursToNext === 0 ? (
              <span className="text-xs text-green-500 font-medium">Max Level!</span>
            ) : (
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="whitespace-pre-line">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 