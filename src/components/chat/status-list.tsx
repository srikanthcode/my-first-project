import { Avatar } from "@/components/ui/avatar";

import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function StatusList() {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* My Status */}
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors">
                <div className="relative">
                    <Avatar
                        src={user?.avatar}
                        alt={user?.name || "My Status"}
                        size="md"
                    />
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-0.5 border-2 border-background dark:border-background-dark">
                        <Plus className="w-3 h-3 text-white" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                        My Status
                    </h3>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                        Click to add status update
                    </p>
                </div>
            </div>

            <div className="px-4 py-2 text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase">
                Recent updates
            </div>

            {/* Mock Recent Updates */}
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
                >
                    <div className="p-[2px] rounded-full border-2 border-primary">
                        <Avatar
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                            alt={`User ${i}`}
                            size="md"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                            User {i}
                        </h3>
                        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                            Today, 10:00 AM
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
