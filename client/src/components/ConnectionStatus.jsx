const ConnectionStatus = ({ connected }) => (
  <div className="flex items-center gap-2 text-sm">
    <span
      className={`w-2 h-2 rounded-full ${
        connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`}
    />
    <span className="text-gray-500">
      {connected
        ? 'Live — connected'
        : 'Disconnected — reconnecting...'}
    </span>
  </div>
);

export default ConnectionStatus;
