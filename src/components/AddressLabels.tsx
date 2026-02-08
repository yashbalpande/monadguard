import { useState, useEffect } from "react";
import { Plus, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddressLabel {
  address: string;
  label: string;
  category: "trusted" | "risky" | "personal" | "other";
  notes?: string;
}

export default function AddressLabels() {
  const [labels, setLabels] = useState<AddressLabel[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState<"trusted" | "risky" | "personal" | "other">("personal");
  const [newNotes, setNewNotes] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("addressLabels");
    if (saved) {
      setLabels(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  const saveLabels = (newLabels: AddressLabel[]) => {
    setLabels(newLabels);
    localStorage.setItem("addressLabels", JSON.stringify(newLabels));
  };

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim() || !newLabel.trim()) return;

    const label: AddressLabel = {
      address: newAddress.toLowerCase(),
      label: newLabel,
      category: newCategory,
      notes: newNotes || undefined,
    };

    saveLabels([...labels, label]);
    setNewAddress("");
    setNewLabel("");
    setNewCategory("personal");
    setNewNotes("");
  };

  const handleRemoveLabel = (address: string) => {
    saveLabels(labels.filter((l) => l.address !== address));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "trusted":
        return "bg-green-950 text-green-300 border-green-800";
      case "risky":
        return "bg-red-950 text-red-300 border-red-800";
      case "personal":
        return "bg-blue-950 text-blue-300 border-blue-800";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trusted":
        return "✓";
      case "risky":
        return "⚠";
      case "personal":
        return "👤";
      default:
        return "📌";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Address Book</h2>
        <p className="text-gray-400">
          Tag and label addresses to quickly identify trusted wallets and risky contracts
        </p>
      </div>

      {/* Add New Label Form */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Add New Label</h3>
        <form onSubmit={handleAddLabel} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Label</label>
              <input
                type="text"
                placeholder="My Wallet / Uniswap / etc"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="personal">Personal Wallet</option>
                <option value="trusted">Trusted Address</option>
                <option value="risky">Risky/Scam</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
            <textarea
              placeholder="Add notes about this address..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              rows={2}
            />
          </div>

          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Label
          </Button>
        </form>
      </div>

      {/* Labels List */}
      <div className="space-y-3">
        {labels.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
            <Tag className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">No labels yet. Add one to get started.</p>
          </div>
        ) : (
          labels.map((label) => (
            <div
              key={label.address}
              className={`border rounded-lg p-4 ${getCategoryColor(label.category)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(label.category)}</span>
                    <h3 className="font-semibold">{label.label}</h3>
                    <span className="text-xs px-2 py-1 bg-black bg-opacity-30 rounded">
                      {label.category}
                    </span>
                  </div>
                  <p className="text-xs font-mono opacity-75 break-all">
                    {label.address}
                  </p>
                  {label.notes && (
                    <p className="text-xs mt-2 opacity-75">{label.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveLabel(label.address)}
                  className="opacity-75 hover:opacity-100 transition-opacity"
                  title="Remove label"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300">
        <p className="font-semibold mb-2">💡 Tips:</p>
        <ul className="space-y-1 text-xs">
          <li>• Use "Trusted" for your wallets and known protocols</li>
          <li>• Mark contracts as "Risky" if you detect suspicious behavior</li>
          <li>• Add notes to remember why you labeled an address</li>
          <li>• Labels are stored locally in your browser</li>
        </ul>
      </div>
    </div>
  );
}
