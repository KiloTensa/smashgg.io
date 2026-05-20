import { motion } from 'framer-motion';
import SmashTitle from './SmashTitle';
import PlayerGameCard from './PlayerGameCard';

export default function GameScreen({ players, onWinRound }) {
  return (
    <div className="flex flex-col items-center w-full">
      <SmashTitle subtitle="¡Que empiece la batalla!">SMASH GUN GAME</SmashTitle>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full flex flex-wrap justify-center gap-5 px-4 pb-8"
      >
        {players.map((player, i) => (
          <PlayerGameCard
            key={i}
            player={player}
            playerIndex={i}
            onWinRound={onWinRound}
          />
        ))}
      </motion.div>
    </div>
  );
}