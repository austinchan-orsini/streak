import { useMemo, useState } from 'react';
import type { User } from './types';
import { useAuth } from './hooks/useAuth';
import { useDailyTasks } from './hooks/useDailyTasks';
import { CORE_TASKS, DEFAULT_WORKOUT_TAGS } from './data/tasks';
import { readFileAsDataUrl } from './utils/files';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupWizard } from './pages/SignupWizard';
import { TodayPage } from './pages/TodayPage';
import { CalendarPage } from './pages/CalendarPage';
import { ProfilePage } from './pages/ProfilePage';

type PageKey = 'today' | 'calendar' | 'profile';

const navItems: { key: PageKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'profile', label: 'Profile' },
];

function MainApp({
  currentUser,
  logout,
  updateCurrentUser,
}: {
  currentUser: User;
  logout: () => void;
  updateCurrentUser: (updates: Partial<Omit<User, 'id'>>) => Promise<void>;
}) {
  const [page, setPage] = useState<PageKey>('today');
  const todayDate = useMemo(() => new Date(), []);

  const {
    tasks,
    coreTasks,
    customTasks,
    progress,
    doneCount,
    total,
    coreDoneCount,
    customDoneCount,
    coreTotal,
    customTotal,
    isDone,
    toggleTask,
    setTaskValue,
    setTaskNote,
    setTaskTags,
    addCustomTask,
    removeCustomTask,
    updateCustomTask,
    setTaskMeals,
    setTaskPhotos,
    addTaskPhotos,
    getDayProgress,
    setDayProgress,
    history,
    workoutTags,
    addWorkoutTag,
    dataLoading,
    loadError,
  } = useDailyTasks(CORE_TASKS, [], todayDate, currentUser.id, DEFAULT_WORKOUT_TAGS);

  const handlePhotoUpload = async (taskId: string, files: FileList) => {
    const newEntries = await Promise.all(Array.from(files).map(readFileAsDataUrl));
    addTaskPhotos(taskId, newEntries);
  };

  if (dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C6E89E] border-t-transparent" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-ink">
        <div className="text-[18px] font-[800]">Couldn't load your data</div>
        <div className="max-w-sm text-[14px] text-[#8C7F6D]">
          We couldn't reach the server to load your saved progress. Please check your connection and refresh the page. Nothing has been lost.
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-[18px] bg-lime px-4 py-3 text-[13px] font-[700] text-ink transition hover:opacity-90"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg px-4 py-3 text-ink md:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3">
        <header className="flex items-center justify-between rounded-[24px] bg-card px-5 py-2.5 shadow-card">
          <div className="text-[26px] font-[800] tracking-[-0.6px] text-[#8C7F6D]">streak</div>
          <nav className="flex gap-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setPage(item.key)}
                className={`rounded-[20px] px-4 py-2 text-[13px] font-[800] transition ${
                  page === item.key ? 'bg-ink text-bg shadow-lifted' : 'bg-panel text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        {page === 'today' && (
          <TodayPage
            tasks={tasks}
            coreTasks={coreTasks}
            customTasks={customTasks}
            progress={progress}
            doneCount={doneCount}
            total={total}
            coreDoneCount={coreDoneCount}
            coreTotal={coreTotal}
            customDoneCount={customDoneCount}
            customTotal={customTotal}
            isDone={isDone}
            toggleTask={toggleTask}
            setTaskNote={setTaskNote}
            setTaskValue={setTaskValue}
            setTaskMeals={setTaskMeals}
            setTaskPhotos={setTaskPhotos}
            handlePhotoUpload={handlePhotoUpload}
            workoutTags={workoutTags}
            setTaskTags={setTaskTags}
            addWorkoutTag={addWorkoutTag}
          />
        )}
        {page === 'calendar' && (
          <CalendarPage
            tasks={tasks}
            coreTasks={coreTasks}
            history={history}
            getDayProgress={getDayProgress}
            setDayProgress={setDayProgress}
            workoutTags={workoutTags}
            addWorkoutTag={addWorkoutTag}
            startDate={currentUser.startDate}
          />
        )}
        {page === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            customTasks={customTasks}
            tasks={tasks}
            history={history}
            addCustomTask={addCustomTask}
            removeCustomTask={removeCustomTask}
            updateCustomTask={updateCustomTask}
            onLogout={logout}
            onUpdateUser={updateCurrentUser}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  const { currentUser, authLoading, login, signup, logout, updateCurrentUser } = useAuth();
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C6E89E] border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        {authView === 'landing' && (
          <LandingPage
            onLogin={() => setAuthView('login')}
            onSignup={() => setAuthView('signup')}
          />
        )}
        {authView === 'login' && (
          <LoginPage onLogin={login} onBack={() => setAuthView('landing')} />
        )}
        {authView === 'signup' && (
          <SignupWizard onSignup={signup} onBack={() => setAuthView('landing')} />
        )}
      </>
    );
  }

  return (
    <MainApp currentUser={currentUser} logout={logout} updateCurrentUser={updateCurrentUser} />
  );
}

export default App;
