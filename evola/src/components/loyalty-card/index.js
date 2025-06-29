import React from 'react';

export default function EvolaLoyaltyCard({ character, rank = 'B', corpRank = 'A', loyaltyPoints = 0 }) {
  const portraitUrl = `https://images.evetech.net/characters/${character.id}/portrait`;

  return (
    <div className="relative w-full max-w-md mx-auto bg-gray-900 border border-blue-900 shadow-2xl rounded-2xl overflow-hidden p-6 backdrop-blur-md bg-opacity-90 font-sans">
      {/* Glowing Top Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-blue-400 text-xs tracking-widest uppercase font-semibold">Evola Neural Registry</h2>
        <h3 className="text-white font-bold text-lg italic tracking-tight">Capsuleer Loyalty Identity Card</h3>
      </div>

      {/* Portrait and Identity */}
      <div className="flex items-center mb-6">
        <img
          src={portraitUrl}
          alt={`${character.name}'s portrait`}
          className="w-24 h-24 rounded-lg border border-gray-700 shadow-md mr-4"
        />
        <div className="flex-1">
          <h4 className="text-xl font-extrabold text-white leading-tight">{character.name}</h4>
          <p className="text-xs text-gray-400 uppercase">Security Status</p>
          <p className="text-sm text-green-400 font-mono">{character.security_status.toFixed(2)}</p>
          <p className="text-xs text-gray-400 uppercase mt-1">Born</p>
          <p className="text-sm text-yellow-300 font-mono">{new Date(character.birthday).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Rank Display Section */}
<div className="grid grid-cols-2 gap-4 text-center">
  {/* Member Rank */}
  <div className={`p-4 rounded-md shadow-inner ${rankBorder(rank)} ${rankBg(rank)}`}>
    <p className="text-xs text-gray-400 uppercase mb-1 tracking-wider">Member Rank</p>
    <p className={`text-4xl font-bold ${rankGlow(rank)} font-['Orbitron'] tracking-wide`}>
      {rank}
    </p>
  </div>

  {/* Corporation Rank */}
  <div className={`p-4 rounded-md shadow-inner ${rankBorder(corpRank)} ${rankBg(corpRank)}`}>
    <p className="text-xs text-gray-400 uppercase mb-1 tracking-wider">Corp Standing</p>
    <p className={`text-4xl font-bold ${rankGlow(corpRank)} font-['Audiowide'] tracking-wide`}>
      {corpRank}
    </p>
  </div>
</div>

{/* Loyalty Points Display */}
<div className="mt-6 text-center">
  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Loyalty Points</p>
  <p className="text-3xl font-extrabold text-cyan-400 font-['Orbitron'] drop-shadow-[0_0_6px_rgba(34,211,238,0.6)] animate-pulse">
    {loyaltyPoints.toLocaleString()} LP
  </p>
</div>

      {/* Footer */}
      <div className="mt-6 border-t border-gray-700 pt-2 text-xs text-gray-500 font-mono tracking-tight text-center">
        Evola Deliveries — Trusted Capsuleer Logistics<br />
        <span className="text-blue-500">Data certified via CONCORD SecureNET</span>
      </div>
    </div>
  );
}

function rankGlow(rank) {
  switch (rank.toUpperCase()) {
    case 'SSS':
      return 'text-pink-400 animate-pulse drop-shadow-[0_0_6px_rgba(255,0,128,0.8)]';
    case 'SS':
      return 'text-purple-400 animate-pulse drop-shadow-[0_0_6px_rgba(128,0,255,0.7)]';
    case 'S':
      return 'text-yellow-400 animate-pulse drop-shadow-[0_0_6px_rgba(255,255,0,0.8)]';
    case 'A':
      return 'text-green-400';
    case 'B':
      return 'text-blue-400';
    case 'C':
      return 'text-gray-400';
    case 'D':
      return 'text-gray-500';
    case 'E':
    case 'F':
    default:
      return 'text-red-500';
  }
}

function rankBorder(rank) {
  switch (rank.toUpperCase()) {
    case 'SSS':
      return 'border-2 border-pink-500 shadow-pink-500/30';
    case 'SS':
      return 'border-2 border-purple-500 shadow-purple-500/30';
    case 'S':
      return 'border-2 border-yellow-400 shadow-yellow-400/30';
    case 'A':
      return 'border border-green-500';
    case 'B':
      return 'border border-blue-500';
    case 'C':
      return 'border border-gray-400';
    case 'D':
      return 'border border-gray-500';
    case 'E':
    case 'F':
    default:
      return 'border border-red-600';
  }
}

function rankBg(rank) {
  switch (rank.toUpperCase()) {
    case 'SSS':
      return 'bg-pink-950/60';
    case 'SS':
      return 'bg-purple-950/60';
    case 'S':
      return 'bg-yellow-900/50';
    case 'A':
      return 'bg-green-900/40';
    case 'B':
      return 'bg-blue-900/40';
    case 'C':
      return 'bg-gray-800/60';
    case 'D':
      return 'bg-gray-900/80';
    case 'E':
    case 'F':
    default:
      return 'bg-red-950/60';
  }
}