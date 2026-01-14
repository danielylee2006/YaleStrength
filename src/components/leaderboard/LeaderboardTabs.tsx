interface LeaderboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "total", label: "Total" },
  { id: "bench", label: "Bench Press" },
  { id: "squat", label: "Squat" },
  { id: "deadlift", label: "Deadlift" },
];

const LeaderboardTabs = ({ activeTab, onTabChange }: LeaderboardTabsProps) => {
  return (
    <div className="flex bg-muted/50 rounded-xl p-1.5 w-full max-w-2xl mx-auto border border-border/40 transition-shadow duration-300 hover:shadow-md">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
            activeTab === tab.id ? "tab-active" : "tab-inactive hover:bg-muted"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default LeaderboardTabs;
