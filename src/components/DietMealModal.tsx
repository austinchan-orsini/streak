import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import type { MealEntry } from '../types';

const DEFAULT_MEAL_NAMES = ['Breakfast', 'Lunch', 'Dinner'];

function makeMealId() {
  return `meal-${Math.random().toString(36).slice(2, 9)}`;
}

const GripIcon = () => (
  <svg viewBox="0 0 10 18" className="h-[18px] w-2.5" fill="currentColor">
    <circle cx="2.5" cy="3" r="1.5" />
    <circle cx="2.5" cy="9" r="1.5" />
    <circle cx="2.5" cy="15" r="1.5" />
    <circle cx="7.5" cy="3" r="1.5" />
    <circle cx="7.5" cy="9" r="1.5" />
    <circle cx="7.5" cy="15" r="1.5" />
  </svg>
);

function MealRow({
  meal,
  onUpdate,
  onRemove,
}: {
  meal: MealEntry;
  onUpdate: (id: string, field: 'name' | 'what', value: string) => void;
  onRemove: (id: string) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={meal} dragListener={false} dragControls={controls} style={{ listStyle: 'none' }}>
      <div className="flex items-start gap-2.5 rounded-[16px] bg-[#F1EADC] px-3 py-2.5">
        <div
          onPointerDown={(e) => controls.start(e)}
          className="mt-0.5 flex-none cursor-grab touch-none select-none text-[#8C7F6D] active:cursor-grabbing"
        >
          <GripIcon />
        </div>
        <div className="min-w-0 flex-1">
          <input
            value={meal.name}
            onChange={(e) => onUpdate(meal.id, 'name', e.target.value)}
            placeholder="Meal name"
            className="w-full bg-transparent text-[13px] font-[700] text-[#3F3326] focus:outline-none"
          />
          <textarea
            value={meal.what}
            rows={1}
            onChange={(e) => {
              onUpdate(meal.id, 'what', e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="What did you eat?"
            className="mt-0.5 w-full resize-none overflow-hidden bg-transparent text-[13px] leading-5 text-[#3F3326] placeholder:text-[#8C7F6D]/60 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(meal.id)}
          className="mt-0.5 flex-none text-[#8C7F6D] transition hover:text-[#E8A48E]"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>
    </Reorder.Item>
  );
}

export function DietMealModal({
  initialMeals,
  onSave,
  onClose,
}: {
  initialMeals: MealEntry[] | undefined;
  onSave: (meals: MealEntry[]) => void;
  onClose: () => void;
}) {
  const [meals, setMeals] = useState<MealEntry[]>(() => {
    if (initialMeals && initialMeals.length > 0) return initialMeals;
    return DEFAULT_MEAL_NAMES.map((name) => ({ id: makeMealId(), name, what: '' }));
  });

  const update = (id: string, field: 'name' | 'what', value: string) =>
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));

  const remove = (id: string) => setMeals((prev) => prev.filter((m) => m.id !== id));

  const add = () => setMeals((prev) => [...prev, { id: makeMealId(), name: '', what: '' }]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 p-5 pb-3">
          <div>
            <div className="text-[18px] font-[800]">Meal log</div>
            <div className="text-[12px] text-[#8C7F6D]">Drag to reorder -- tap x to remove</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[16px] border border-[rgba(63,51,38,0.10)] px-3 py-2 text-[12px] font-[700]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-2">
          <Reorder.Group
            axis="y"
            values={meals}
            onReorder={setMeals}
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {meals.map((meal) => (
              <MealRow key={meal.id} meal={meal} onUpdate={update} onRemove={remove} />
            ))}
          </Reorder.Group>

          <button
            type="button"
            onClick={add}
            className="mt-2 w-full rounded-[16px] border border-dashed border-[rgba(63,51,38,0.15)] bg-[#F7F4EB] px-4 py-2.5 text-[12px] font-[700] text-[#8C7F6D] transition hover:border-ink hover:text-ink"
          >
            + Add meal
          </button>
        </div>

        <div className="flex justify-end gap-3 p-5 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[16px] border border-[rgba(63,51,38,0.10)] px-3 py-2.5 text-[12px] font-[700]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(meals);
              onClose();
            }}
            className="rounded-[16px] bg-ink px-4 py-2.5 text-[12px] font-[700] text-bg"
          >
            Save log
          </button>
        </div>
      </div>
    </div>
  );
}
