type WebSearchSource = {
  title: string;
  url: string;
  snippet: string;
};

type WebSearchSourcesProps = {
  sources: WebSearchSource[];
  messageId: string;
  index: number;
};

export function WebSearchSources({ sources, messageId, index }: WebSearchSourcesProps) {
  if (!sources || sources.length === 0) {
    return (
      <div
        key={`${messageId}-web_search-${index}`}
        className="bg-zinc-800/50 border border-zinc-700 rounded mt-1 mb-2 p-3"
      >
        <div className="text-sm text-green-400 font-medium mb-2">
          ✅ Web search complete
        </div>
        <div className="text-sm text-zinc-500">No sources found</div>
      </div>
    );
  }

  return (
    <div
      key={`${messageId}-web_search-${index}`}
      className="bg-zinc-800/50 border border-zinc-700 rounded mt-1 mb-2 overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-zinc-700 bg-zinc-900/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-green-400 font-medium">
            ✅ Web search complete
          </div>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
            {sources.length} {sources.length === 1 ? 'source' : 'sources'}
          </span>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="p-3 space-y-2">
        {sources.map((source, sourceIndex) => (
          <SourceCard key={sourceIndex} source={source} index={sourceIndex} />
        ))}
      </div>
    </div>
  );
}

function SourceCard({ source, index }: { source: WebSearchSource; index: number }) {
  const hostname = new URL(source.url).hostname.replace('www.', '');

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-zinc-900/50 border border-zinc-700 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all duration-200 group"
    >
      {/* Header with number badge and external link icon */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center text-xs text-zinc-400 font-medium">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="text-sm font-medium text-blue-400 group-hover:text-blue-300 mb-1 line-clamp-2">
            {source.title}
          </h4>

          {/* Domain */}
          <div className="flex items-center gap-1.5 mb-2">
            <svg
              className="w-3 h-3 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="text-xs text-zinc-500 truncate">{hostname}</span>
          </div>

          {/* Snippet */}
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
            {source.snippet}
          </p>
        </div>

        {/* External link icon */}
        <svg
          className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
    </a>
  );
}
