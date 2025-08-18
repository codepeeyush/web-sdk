"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    ChevronDown,
    EllipsisVertical,
    HardDrive,
    Power,
    Server,
    ShieldAlert,
    MemoryStick,
} from "lucide-react";
import { toast } from "sonner";

function StatusBadge({ label, color = "green" }: { label: string; color?: "green" | "blue" | "red" | "yellow" | "gray" }) {
    const colorMap: Record<string, string> = {
        green: "bg-green-500/10 text-green-500 border-green-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-400/20",
        red: "bg-red-500/10 text-red-400 border-red-400/20",
        yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
        gray: "bg-muted text-muted-foreground border-border",
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${colorMap[color]}`}>
            <span className="size-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

type Instance = {
    id: string;
    name: string;
    status: "ACTIVE" | "SWITCHING" | "PROVISIONING" | "DISABLED";
    type: string;
    description: string;
    ramGB: number;
    storageGB: number;
};

const LOCAL_STORAGE_KEY = "astrohost:instances";
const SEED_VERSION_KEY = "astrohost:seedVersion";
const CURRENT_SEED_VERSION = "2";

export default function Content() {
    const defaultInstances: Instance[] = [
        {
            id: "inst_quantum",
            name: "Quantum Realm",
            status: "DISABLED",
            type: "Fabric 1.20.x",
            description: "High-tech compute cluster",
            ramGB: 16,
            storageGB: 80,
        },
        {
            id: "inst_nebula",
            name: "Nebula Network",
            status: "DISABLED",
            type: "Vanilla 1.21.x",
            description: "Space-themed multiplayer node",
            ramGB: 8,
            storageGB: 40,
        },
        {
            id: "inst_forest",
            name: "Digital Forest",
            status: "DISABLED",
            type: "Paper 1.19.4 Latest",
            description: "Nature-meets-tech sandbox",
            ramGB: 4,
            storageGB: 20,
        },
        {
            id: "inst_oasis",
            name: "Cyber Oasis",
            status: "DISABLED",
            type: "Fabric 1.20.x",
            description: "A digital sanctuary server",
            ramGB: 4,
            storageGB: 20,
        },
        {
            id: "inst_echo",
            name: "Echo Chamber",
            status: "DISABLED",
            type: "Vanilla 1.21.x",
            description: "Communication-focused staging",
            ramGB: 2,
            storageGB: 10,
        },
        {
            id: "inst_phantom",
            name: "Phantom Grid",
            status: "DISABLED",
            type: "Paper 1.19.4 Latest",
            description: "Mysterious edge node",
            ramGB: 8,
            storageGB: 40,
        },
        {
            id: "inst_velocity",
            name: "Velocity Hub",
            status: "DISABLED",
            type: "Fabric 1.20.x",
            description: "Fast and dynamic worker",
            ramGB: 4,
            storageGB: 20,
        },
        {
            id: "inst_apex",
            name: "Apex Nexus",
            status: "ACTIVE",
            type: "Paper 1.19.4 Latest",
            description: "Central powerful instance",
            ramGB: 16,
            storageGB: 80,
        },
    ];

    const [instances, setInstances] = useState<Instance[]>(defaultInstances);

    // Load instances from localStorage on mount (with seed versioning)
    useEffect(() => {
        try {
            const raw = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
            const seedVersion = typeof window !== "undefined" ? localStorage.getItem(SEED_VERSION_KEY) : null;
            if (!raw || seedVersion !== CURRENT_SEED_VERSION) {
                setInstances(defaultInstances);
                if (typeof window !== "undefined") {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultInstances));
                    localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
                }
            } else {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) setInstances(parsed as Instance[]);
            }
        } catch (err) {
            console.warn("[Instances] Failed to read from localStorage", err);
        }
        // We intentionally run this once on mount to seed data; defaultInstances is static in this scope.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist instances to localStorage whenever they change
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(instances));
            }
        } catch (err) {
            console.warn("[Instances] Failed to write to localStorage", err);
        }
    }, [instances]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [form, setForm] = useState<{ name: string; type: string; description: string; ramGB: number; storageGB: number }>({
        name: "",
        type: "Paper 1.19.4 Latest",
        description: "",
        ramGB: 2,
        storageGB: 20,
    });

    // Manage modal state
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [manageId, setManageId] = useState<string | null>(null);
    const [manageForm, setManageForm] = useState<{ name: string; type: string; description: string; ramGB: number; storageGB: number }>({
        name: "",
        type: "Paper 1.19.4 Latest",
        description: "",
        ramGB: 2,
        storageGB: 20,
    });

    const statusToColor = useMemo(() => ({
        ACTIVE: "green" as const,
        SWITCHING: "blue" as const,
        PROVISIONING: "yellow" as const,
        DISABLED: "gray" as const,
    }), []);

    // System resources
    const totalRamGB = 128;
    const totalStorageGB = 500;
    const totalInstanceSlots = 64;
    const usedRamGB = useMemo(() => instances.reduce((sum, i) => sum + i.ramGB, 0), [instances]);
    const usedStorageGB = useMemo(() => instances.reduce((sum, i) => sum + i.storageGB, 0), [instances]);
    const availableRamGB = totalRamGB - usedRamGB;
    const availableStorageGB = totalStorageGB - usedStorageGB;
    const remainingInstanceSlots = Math.max(0, totalInstanceSlots - instances.length);

    function handleCreateInstance(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Please provide a name for the instance.");
            return;
        }

        const newInstance: Instance = {
            id: `inst_${Math.random().toString(36).slice(2, 9)}`,
            name: form.name.trim(),
            status: "PROVISIONING",
            type: form.type,
            description: form.description || "",
            ramGB: form.ramGB,
            storageGB: form.storageGB,
        };
        if (form.ramGB > availableRamGB) {
            toast.error(`Not enough RAM available. Available: ${availableRamGB} GB`);
            return;
        }
        if (form.storageGB > availableStorageGB) {
            toast.error(`Not enough storage available. Available: ${availableStorageGB} GB`);
            return;
        }
        setInstances((prev) => [newInstance, ...prev]);
        setIsCreateOpen(false);
        setForm({ name: "", type: "Paper 1.19.4 Latest", description: "", ramGB: 2, storageGB: 20 });
        toast.success("Instance creation started.");

        // Simulate provisioning complete
        setTimeout(() => {
            setInstances((prev) =>
                prev.map((i) => (i.id === newInstance.id ? { ...i, status: "ACTIVE" } : i))
            );
            toast.success("Instance is now active.");
        }, 1200);
    }

    function handleDelete(id: string) {
        setInstances((prev) => prev.filter((i) => i.id !== id));
        toast.success("Instance deleted");
    }

    function handleSwitch(id: string) {
        setInstances((prev) => {
            const target = prev.find((i) => i.id === id);
            if (!target) return prev;
            if (target.status === "PROVISIONING" || target.status === "SWITCHING") return prev;
            if (target.status === "ACTIVE") return prev;
            return prev.map((i) => (i.id === id ? { ...i, status: "SWITCHING" } : i));
        });

        setTimeout(() => {
            setInstances((prev) => {
                const currentActive = prev.find((i) => i.status === "ACTIVE");
                return prev.map((i) => {
                    if (i.id === id) return { ...i, status: "ACTIVE" };
                    if (currentActive && i.id === currentActive.id) return { ...i, status: "DISABLED" };
                    return i;
                });
            });
            toast.success("Switched active instance");
        }, 1000);
    }

    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-semibold">My Server</h1>
                        {/* removed game meta badges as requested */}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="lg" className="gap-2">
                        <ShieldAlert className="w-4 h-4" /> Unavailable
                    </Button>
                    <Button variant="destructive" size="lg" className="gap-2">
                        <Power className="w-4 h-4" /> Shut Down
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="w-10 h-10">
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-1">
                            <div className="flex flex-col">
                                <button className="text-left text-sm px-2.5 py-1.5 rounded hover:bg-accent">Restart Server</button>
                                <button className="text-left text-sm px-2.5 py-1.5 rounded hover:bg-accent">Rename</button>
                                <button className="text-left text-sm px-2.5 py-1.5 rounded hover:bg-accent text-red-500">Delete</button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Manage Instance dialog */}
            <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Manage instance</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const res = await fetch("/api/manage-instance", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ id: manageId, ...manageForm }),
                                });
                                const data = await res.json();
                                if (!res.ok || !data?.success) {
                                    console.error("[ManageInstance] failed", { status: res.status, data });
                                    toast.error(data?.error ?? "Update failed.");
                                    return;
                                }
                            } catch {
                                console.error("[ManageInstance] network-error");
                                toast.error("Network error while updating instance.");
                            }
                        }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="m_name">Name</Label>
                                <Input
                                    id="m_name"
                                    value={manageForm.name}
                                    onChange={(e) => setManageForm((f) => ({ ...f, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="m_type">Type</Label>
                                <select
                                    id="m_type"
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    value={manageForm.type}
                                    onChange={(e) => setManageForm((f) => ({ ...f, type: e.target.value }))}
                                >
                                    <option>Paper 1.19.4 Latest</option>
                                    <option>Fabric 1.20.x</option>
                                    <option>Vanilla 1.21.x</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="m_ram">RAM</Label>
                                <select
                                    id="m_ram"
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    value={manageForm.ramGB}
                                    onChange={(e) => setManageForm((f) => ({ ...f, ramGB: Number(e.target.value) }))}
                                >
                                    {[1, 2, 4, 8, 16, 32].map((g) => (
                                        <option key={g} value={g}>{g} GB</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="m_storage">Storage</Label>
                                <select
                                    id="m_storage"
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    value={manageForm.storageGB}
                                    onChange={(e) => setManageForm((f) => ({ ...f, storageGB: Number(e.target.value) }))}
                                >
                                    {[10, 20, 40, 80, 160].map((g) => (
                                        <option key={g} value={g}>{g} GB</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="m_desc">Description</Label>
                                <Input
                                    id="m_desc"
                                    value={manageForm.description}
                                    onChange={(e) => setManageForm((f) => ({ ...f, description: e.target.value }))}
                                />
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-between">
                            <DialogClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* System Stats */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
                <SystemStat title="RAM" used={usedRamGB} total={totalRamGB} unit="GB" icon={<MemoryStick className="w-4 h-4" />} />
                <SystemStat title="Storage" used={usedStorageGB} total={totalStorageGB} unit="GB" icon={<HardDrive className="w-4 h-4" />} />
                <SystemStat title="Instances" used={instances.length} total={totalInstanceSlots} unit="slots" icon={<Server className="w-4 h-4" />} />
            </div>

            {/* Secondary nav */}
            <div className="mt-6 rounded-md border bg-card">
                <nav className="flex gap-1 overflow-x-auto px-2 py-1 text-sm">
                    {[
                        "Overview",
                        "Console",
                        "Files",
                        "Config",
                        "Plugins",
                        "Modpacks",
                    ].map((tab, idx) => (
                        <button
                            key={tab}
                            className={`px-3 py-2 rounded-md font-medium whitespace-nowrap ${idx === 0 ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Instances card */
            }
            <div className="mt-6 rounded-md border bg-card">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="space-y-0.5">
                        <p className="text-sm font-medium">Instances</p>
                        <p className={`text-xs ${remainingInstanceSlots === 0 ? "text-red-500" : "text-muted-foreground"}`}>
                            {remainingInstanceSlots} instance{remainingInstanceSlots === 1 ? "" : "s"} remaining
                        </p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="gap-2" disabled={remainingInstanceSlots === 0}>
                                <Server className="w-4 h-4" /> Create New Instance
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Create a new instance</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateInstance} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="My Awesome Server"
                                            value={form.name}
                                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="type">Type</Label>
                                        <select
                                            id="type"
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                            value={form.type}
                                            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                                        >
                                            <option>Paper 1.19.4 Latest</option>
                                            <option>Fabric 1.20.x</option>
                                            <option>Vanilla 1.21.x</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ram">RAM</Label>
                                        <select
                                            id="ram"
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                            value={form.ramGB}
                                            onChange={(e) => setForm((f) => ({ ...f, ramGB: Number(e.target.value) }))}
                                        >
                                            {[1, 2, 4, 8, 16].map((g) => (
                                                <option key={g} value={g} disabled={g > availableRamGB}>{g} GB</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-muted-foreground">Available: {availableRamGB} GB</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="storage">Storage</Label>
                                        <select
                                            id="storage"
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                            value={form.storageGB}
                                            onChange={(e) => setForm((f) => ({ ...f, storageGB: Number(e.target.value) }))}
                                        >
                                            {[10, 20, 40, 80, 160].map((g) => (
                                                <option key={g} value={g} disabled={g > availableStorageGB}>{g} GB</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-muted-foreground">Available: {availableStorageGB} GB</p>
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <Input
                                            id="desc"
                                            placeholder="Optional description"
                                            value={form.description}
                                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="sm:justify-between">
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Create Instance</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="px-2 md:px-4 py-2">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground">
                                    <th className="text-left font-medium px-2 py-3">Name</th>
                                    <th className="text-left font-medium px-2 py-3">Status</th>
                                    <th className="text-left font-medium px-2 py-3">Type</th>
                                    <th className="text-left font-medium px-2 py-3">Resources</th>
                                    <th className="text-left font-medium px-2 py-3">Description</th>
                                    <th className="text-right font-medium px-2 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {instances.map((inst) => (
                                    <tr key={inst.id}>
                                        <td className="px-2 py-3">
                                            <div className="flex items-center gap-2">
                                                <HardDrive className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">{inst.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3">
                                            <StatusBadge label={inst.status} color={statusToColor[inst.status]} />
                                        </td>
                                        <td className="px-2 py-3 text-muted-foreground">{inst.type}</td>
                                        <td className="px-2 py-3 text-muted-foreground">{inst.ramGB} GB RAM • {inst.storageGB} GB Storage</td>
                                        <td className="px-2 py-3 text-muted-foreground">{inst.description || "-"}</td>
                                        <td className="px-2 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                {inst.status !== "ACTIVE" ? (
                                                    <Button variant="outline" size="sm" onClick={() => handleSwitch(inst.id)} disabled={inst.status === "PROVISIONING" || inst.status === "SWITCHING"}>
                                                        {inst.status === "SWITCHING" ? "Switching..." : "Switch"}
                                                    </Button>
                                                ) : null}
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" size="icon">
                                                            <EllipsisVertical className="w-4 h-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent align="end" className="w-44 p-1">
                                                        <div className="flex flex-col">
                                                            <button className="text-left text-sm px-2.5 py-1.5 rounded hover:bg-accent" onClick={() => {
                                                                setManageId(inst.id);
                                                                setManageForm({ name: inst.name, type: inst.type, description: inst.description, ramGB: inst.ramGB, storageGB: inst.storageGB });
                                                                setIsManageOpen(true);
                                                            }}>Manage</button>
                                                            <button className="text-left text-sm px-2.5 py-1.5 rounded hover:bg-accent" onClick={async () => {
                                                                try {
                                                                    const res = await fetch("/api/clone-instance", {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ id: inst.id }),
                                                                    });
                                                                    const data = await res.json();
                                                                    if (!res.ok || !data?.success) {
                                                                        console.error("[CloneInstance] failed", { status: res.status, data });
                                                                        toast.error(data?.error ?? "Clone failed.");
                                                                    }
                                                                } catch {
                                                                    console.error("[CloneInstance] network-error");
                                                                    toast.error("Network error while cloning instance.");
                                                                }
                                                            }}>Clone</button>
                                                            <button onClick={() => handleDelete(inst.id)} className="text-left text-sm px-2.5 py-1.5 rounded hover:bg-accent text-red-500">Delete</button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SystemStat({ title, used, total, unit, icon }: { title: string; used: number; total: number; unit: string; icon?: React.ReactNode }) {
    const pct = Math.min(100, Math.round((used / Math.max(1, total)) * 100));
    return (
        <div className="rounded-md border bg-card p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                    {icon}
                    {title}
                </div>
                <div className="text-sm text-muted-foreground">
                    {used} / {total} {unit}
                </div>
            </div>
            <div className="mt-2 h-2 w-full rounded bg-secondary">
                <div className="h-2 rounded bg-primary" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}