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
  updateCurrentUser: (updates: Partial<Omit<User, 'id'>>) => void;
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
    history,
    workoutTags,
    addWorkoutTag,
    seedDayComplete,
    clearDay,
  } = useDailyTasks(CORE_TASKS, [], todayDate, currentUser.id, DEFAULT_WORKOUT_TAGS);

  const handlePhotoUpload = async (taskId: string, files: FileList) => {
    const newEntries = await Promise.all(Array.from(files).map(readFileAsDataUrl));
    addTaskPhotos(taskId, newEntries);
  };

  return (
    <div className="min-h-screen bg-bg px-5 py-5 text-ink md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
        <header className="flex flex-col gap-6 rounded-[32px] bg-card p-6 shadow-card md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[13px] font-[700] uppercase tracking-[1.6px] text-[#8C7F6D]">streak</div>
            <div className="mt-3 text-[32px] font-[800] tracking-[-1px]">75 Hard -- daily progress</div>
          </div>
          <nav className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setPage(item.key)}
                className={`rounded-[24px] px-5 py-3 text-[13px] font-[800] transition ${
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
            addCustomTask={addCustomTask}
            setTaskMeals={setTaskMeals}
            setTaskPhotos={setTaskPhotos}
            handlePhotoUpload={handlePhotoUpload}
            workoutTags={workoutTags}
            setTaskTags={setTaskTags}
            addWorkoutTag={addWorkoutTag}
          />
        )}
        {page === 'calendar' && (
          <CalendarPage tasks={tasks} history={history} getDayProgress={getDayProgress} />
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
            seedDayComplete={seedDayComplete}
            clearDay={clearDay}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  const { currentUser, login, signup, logout, updateCurrentUser } = useAuth();
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');

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
