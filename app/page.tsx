"use client";
import {  useEffect, useState } from "react";
import { Trash2 } from "lucide-react";


function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  return `${minutes}m`;
}
export default function Home() {
  const [activities, setActivities] = useState<
     {
    id: number;
    name: string;
    category: string;
    duration: number;
    startTime: number | null;
    
  }[]
   >([
  {
    id: 1,
    name: "video game",
    category: "Entertainment",
    duration: 7200,
    startTime: null
  },
  {
    id: 2,
    name: "writing a book",
    category: "Work",
    duration: 4200,
    startTime: null,
  },
  {
    id: 3,
    name: "learning entrepreneurship",
    category: "Growth",
    duration: 2700,
    startTime: null,
  },
]);

  const [isFormOpen, setIsFormOpen] = useState(false);
const [activityName, setActivityName] = useState("");
const [category, setCategory] = useState("Other");
const [activeActivityId, setActiveActivityId] = useState<number | null>(null);
const [currentTime, setCurrentTime] = useState(Date.now());
const [hasLoaded, setHasLoaded] = useState(false);
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(Date.now());
  }, 1000);

  return () => clearInterval(timer);
}, []);
useEffect(() => {
  const savedActivities = localStorage.getItem("activities");

  if (savedActivities) {
    const parsedActivities = JSON.parse(savedActivities) as typeof activities;

    setActivities(parsedActivities);

    const runningActivity = parsedActivities.find(
      (activity) => activity.startTime !== null
    );

    if (runningActivity) {
      setActiveActivityId(runningActivity.id);
    }
  }

  setHasLoaded(true);
}, []);
useEffect(() => {
  if (!hasLoaded) {
    return;
  }

  localStorage.setItem(
    "activities",
    JSON.stringify(activities)
  );
}, [activities, hasLoaded]);
function startActivity(id: number) {
    if (activeActivityId !== null) {
    return;
  }
  setActivities(
    activities.map((activity) =>
      activity.id === id
        ? { ...activity, startTime: Date.now() }
        : activity
    )
  );

  setActiveActivityId(id);
}
function stopActivity(id: number) {
  setActivities(
    activities.map((activity) => {
      if (activity.id !== id || activity.startTime === null) {
        return activity;
      }

      const elapsed = Date.now() - activity.startTime;

      return {
        ...activity,
        duration: activity.duration + elapsed / 1000,
        startTime: null,
      };
    })
  );

  setActiveActivityId(null);
}
function addActivity() {
  if (!activityName.trim()) {
    return;
  }

  const newActivity = {
    id: Date.now(),
    name: activityName,
    category: category,
    duration: 0,
    startTime: null,
  };

  setActivities([...activities, newActivity]);

  setActivityName("");
  setCategory("Other");
  setIsFormOpen(false);
}

function deleteActivity(id: number) {
  setActivities(
    activities.filter((activity) => activity.id !== id)
  );
}

const totalDuration = activities.reduce(
  (total, activity) => total + activity.duration,
  0
);
const categoryTotals = activities.reduce(
  (totals, activity) => {
    totals[activity.category] =
      (totals[activity.category] || 0) + activity.duration;

    return totals;
  },
  {} as Record<string, number>
);
const categories = ["Entertainment", "Work", "Health", "Growth"].filter(
  (category) => categoryTotals[category] > 0
);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-950">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950">
                TMS
              </div>

              <div>
                <p className="text-base font-semibold tracking-tight text-white">
                  Time Management System
                </p>
                <p className="text-xs text-slate-500">
                  Understand your day
                </p>
              </div>
            </div>

            
          </div>
     </nav>

      
      <div className="mx-auto max-w-6xl px-6 py-10">
       
        <section className="mb-10">
          <p className="mb-2 text-sm text-slate-400">Hey There, </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Here's how you spent your time today.
          </h2>
        </section>
        <section className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total tracked</p>
            <p className="mt-3 text-4xl font-bold">{formatDuration(totalDuration)}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Activities</p>
            <p className="mt-3 text-4xl font-bold"> {activities.length}</p>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Today's time</h3>

            <span className="text-sm text-slate-500">{formatDuration(totalDuration)} total</span>
          </div>

         {categories.length > 0 && (
        <div className="space-y-5 rounded-3xl border border-amber-200 bg-slate-900 p-6">
          {categories.map((category) => {
              const duration = categoryTotals[category] || 0;

              const percentage =
                totalDuration > 0
                  ? (duration / totalDuration) * 100
                  : 0;

              return (
                <TimeRow
                  key={category}
                  name={category}
                  time={formatDuration(duration)}
                  width={`${percentage}%`}
                />
              );
           })}
        </div>
           )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent activities</h3>
            <button
              onClick={() => setIsFormOpen(true)}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950 transition "
            >
              + Add activity
            </button>
            {isFormOpen && (
  <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="mb-5 text-lg font-semibold">
      Add Activity
    </h3>

    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Activity name
        </label>

        <input
          type="text"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          placeholder="Reading"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-slate-400"
        >
          <option value="Entertainment">Entertainment</option>
          <option value="Work">Work</option>
          <option value="Health">Health</option>
          <option value="Growth">Growth</option>
          <option value="Other">Other</option>
        </select>
     </div>
      

      <div className="flex gap-3">
        <button
          onClick={addActivity}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950"
        >
          Add Activity
        </button>

        <button
          onClick={() => setIsFormOpen(false)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
          </div>

          
<div className="overflow-hidden rounded-3xl border border-amber-200 bg-slate-900">
  {activities.length > 0 ? (
    activities.map((activity) => (
      <Activity
        key={activity.id}
        name={activity.name}
        duration={activity.duration}
        category={activity.category}
        startTime={activity.startTime}
        currentTime={currentTime}
        isAnotherActivityRunning={
          activeActivityId !== null &&
          activeActivityId !== activity.id
        }
        onDelete={() => deleteActivity(activity.id)}
        onStart={() => startActivity(activity.id)}
        onStop={() => stopActivity(activity.id)}
        isRunning={activeActivityId === activity.id}
      />
    ))
  ) : (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="mb-3 text-3xl">🕒</span>
      <h3 className="text-sm font-semibold text-white">
        No activities yet
      </h3>
      <p className="mt-1 max-w-xs text-sm text-slate-400">
        Add your first activity to start tracking where your time goes.
      </p>
    </div>
  )}
</div>

        </section>
      </div>
    </main>
  );
}

function TimeRow({
  name,
  time,
  width,
}: {
  name: string;
  time: string;
  width: string;
})



{
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-400">{time}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function Activity({
  name,
  category,
  duration,
  startTime,
  onDelete,
  onStart,
  currentTime,
  onStop,
  isRunning,
  isAnotherActivityRunning,
}: {
  
  name: string;
  category: string;
  duration: number;
  onDelete: () => void;
  onStart: () => void;
  onStop: () => void;
  startTime: number | null;
  currentTime: number;
  isRunning: boolean;
  isAnotherActivityRunning: boolean;
})  {
  const liveDuration =
  isRunning && startTime !== null
    ? duration + (currentTime - startTime) / 1000
    : duration;
  return (
    <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5 last:border-b-0">
      <div className="flex items-center gap-4">

        <span className="font-medium">{name}</span>
        <p className="mt-1 text-xs text-slate-500">
    {category}
  </p>
      </div>

      <div className="flex items-center gap-4">
  <span className="text-sm text-slate-400">
    {formatDuration(liveDuration)} 
 </span>
  <button
  onClick={isRunning ? onStop : onStart}
  disabled={isAnotherActivityRunning}
  className={isRunning? 'rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40':'rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40'}
>
  {isRunning ? "Stop" : "Start"}
</button>

  <button
    onClick={onDelete}
    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
    aria-label="Delete activity"
  >
    <Trash2 size={18} />
  </button>
</div>
    </div>
  );
}