// src/components/sections/DrawSection.tsx
// 为我画一卷 · 偏好表单（阶段 6）

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  BrushDivider,
  InkButton,
  InkTitle,
  ScrollReveal,
} from '../ui';
import type {
  Companions,
  GeneratedItinerary,
  InterestTag,
  Pace,
  Preference,
  StartLocationId,
  TransportMode,
} from '../../types';
import {
  companionOptions,
  durationOptions,
  interestOptions,
  paceOptions,
  startLocationOptions,
  transportModeOptions,
} from '../../data/preferences';
import { recommendItinerary } from '../../utils/recommend';
import { ItineraryResult } from './ItineraryResult';
import styles from './DrawSection.module.css';

type DurationId = 'half-day' | 'one-day' | 'two-day';

interface FormState {
  startLocation: StartLocationId;
  customLocationText: string;
  duration: DurationId;
  companions: Companions;
  interests: InterestTag[];
  transportMode: TransportMode;
  pace: Pace;
  notes: string;
}

const DEFAULT_FORM: FormState = {
  startLocation: 'in-shunde',
  customLocationText: '',
  duration: 'one-day',
  companions: 'solo',
  interests: [],            // 第一版：默认空，需用户主动选择（避免与其它兴趣形成意外 tie）
  transportMode: 'driving',
  pace: 'standard',
  notes: '',
};

const CUSTOM_LOCATIONS: ReadonlyArray<string> = ['custom'];
const TRANSIT_LOCATIONS: ReadonlyArray<string> = [
  'guangzhou-south',
  'foshan-west',
];

export function DrawSection() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<GeneratedItinerary | null>(null);
  const [errors, setErrors] = useState<{
    duration?: string;
    interests?: string;
    customLocationText?: string;
  }>({});

  // 表单容器 ref：用于"重新选择"时滚回表单顶部
  const formRef = useRef<HTMLFormElement | null>(null);
  // 上一次结果：用于区分"新提交"和"重置"（避免重置时误触发 scrollIntoView）
  const prevResultRef = useRef<GeneratedItinerary | null>(null);

  const ids = {
    startLocation: useId(),
    customLocationText: useId(),
    duration: useId(),
    companions: useId(),
    interests: useId(),
    transportMode: useId(),
    pace: useId(),
    notes: useId(),
  };

  // 选项字典
  const durationOpts = useMemo(() => durationOptions, []);
  const startOpts = useMemo(() => startLocationOptions, []);
  const companionOpts = useMemo(() => companionOptions, []);
  const interestOpts = useMemo(() => interestOptions, []);
  const transportOpts = useMemo(() => transportModeOptions, []);
  const paceOpts = useMemo(() => paceOptions, []);

  // 兴趣切换
  const toggleInterest = useCallback((tag: InterestTag) => {
    setForm((prev) => {
      const exists = prev.interests.includes(tag);
      const next = exists
        ? prev.interests.filter((t) => t !== tag)
        : [...prev.interests, tag];
      return { ...prev, interests: next };
    });
  }, []);

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // 校验
  const validate = useCallback(
    (state: FormState): { ok: boolean; errors: typeof errors } => {
      const e: typeof errors = {};
      if (!state.duration) e.duration = '请选择游玩时长';
      if (state.interests.length === 0)
        e.interests = '请至少选择一项兴趣偏好';
      if (
        CUSTOM_LOCATIONS.includes(state.startLocation) &&
        state.customLocationText.trim() === ''
      ) {
        e.customLocationText = '请填写自定义出发地';
      }
      return { ok: Object.keys(e).length === 0, errors: e };
    },
    [],
  );

  // 提交
  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      const { ok, errors: errs } = validate(form);
      setErrors(errs);
      if (!ok) return;

      const pref: Preference = {
        startLocation: form.startLocation,
        customLocationText: form.customLocationText.trim() || undefined,
        duration: form.duration,
        companions: form.companions,
        interests: form.interests,
        transportMode: form.transportMode,
        pace: form.pace,
        notes: form.notes.trim() || undefined,
      };

      const out = recommendItinerary(pref);
      const isNewResult = prevResultRef.current !== out;
      prevResultRef.current = out;
      setResult(out);

      // 仅在"新推荐"时滚动到结果区；重置后不会触发
      if (isNewResult) {
        requestAnimationFrame(() => {
          const el = document.getElementById('draw-result');
          if (el) {
            const reduceMotion =
              typeof window !== 'undefined' &&
              window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            el.scrollIntoView({
              behavior: reduceMotion ? 'auto' : 'smooth',
              block: 'start',
            });
          }
        });
      }
    },
    [form, validate],
  );

  // 重置：清空表单、错误、结果，滚回表单顶部
  const handleReset = useCallback(() => {
    setForm(DEFAULT_FORM);
    setErrors({});
    setResult(null);
    prevResultRef.current = null;

    // 等 React 完成重新渲染后再滚到表单顶部
    requestAnimationFrame(() => {
      const el = formRef.current;
      if (!el) return;
      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }, []);

  // 当前选择项的说明（用于提示区）
  const startOption = startOpts.find((o) => o.id === form.startLocation);
  const startNote = startOption?.note;
  const showStartNote =
    !!startNote &&
    (CUSTOM_LOCATIONS.includes(form.startLocation) ||
      TRANSIT_LOCATIONS.includes(form.startLocation));

  const transportOption = transportOpts.find(
    (o) => o.id === form.transportMode,
  );
  const showTransportNote = form.transportMode === 'transit' && !!transportOption?.note;

  return (
    <section id="draw" className={styles.draw}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <ScrollReveal direction="up" duration={700}>
            <p className={`${styles.eyebrow} font-data`}>— 为我画一卷 —</p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={120} duration={700}>
            <InkTitle
              title="为我画一卷"
              subtitle="写下偏好，从七卷已核验路线中，选出更适合你的一卷顺德。"
            />
          </ScrollReveal>
        </header>

        <ScrollReveal direction="up" delay={200} duration={700}>
          <form
            ref={formRef}
            id="draw-form"
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            aria-label="行程偏好表单"
          >
            {/* 出发地点 */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>出发地点</legend>
              <div className={styles.optionGrid}>
                {startOpts.map((o) => (
                  <label
                    key={o.id}
                    className={`${styles.option} ${
                      form.startLocation === o.id ? styles.optionActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={ids.startLocation}
                      value={o.id}
                      checked={form.startLocation === o.id}
                      onChange={() => setField('startLocation', o.id)}
                      className={styles.optionInput}
                    />
                    <span className={styles.optionText}>
                      <span className={styles.optionLabel}>{o.label}</span>
                      {o.description && (
                        <span className={`${styles.optionDesc} font-data`}>
                          {o.description}
                        </span>
                      )}
                    </span>
                    {form.startLocation === o.id && (
                      <span className={styles.optionMark} aria-hidden="true">
                        ●
                      </span>
                    )}
                  </label>
                ))}
              </div>

              {CUSTOM_LOCATIONS.includes(form.startLocation) && (
                <div className={styles.subField}>
                  <label htmlFor={ids.customLocationText} className={styles.subLabel}>
                    自定义出发地
                  </label>
                  <input
                    id={ids.customLocationText}
                    type="text"
                    className={styles.input}
                    value={form.customLocationText}
                    onChange={(e) =>
                      setField('customLocationText', e.target.value)
                    }
                    placeholder="例如：深圳北站"
                    aria-invalid={!!errors.customLocationText}
                    aria-describedby={
                      errors.customLocationText
                        ? `${ids.customLocationText}-err`
                        : undefined
                    }
                  />
                  {errors.customLocationText && (
                    <p
                      id={`${ids.customLocationText}-err`}
                      className={styles.error}
                      role="alert"
                    >
                      {errors.customLocationText}
                    </p>
                  )}
                </div>
              )}

              {showStartNote && startNote && (
                <p className={styles.notice} role="note">
                  {startNote}
                </p>
              )}
            </fieldset>

            <BrushDivider tone="light" width={64} />

            {/* 游玩时长 */}
            <fieldset
              className={styles.fieldset}
              aria-invalid={!!errors.duration}
              aria-describedby={errors.duration ? `${ids.duration}-err` : undefined}
            >
              <legend className={styles.legend}>
                游玩时长
                <span className={styles.required} aria-hidden="true">
                  *
                </span>
              </legend>
              <div className={styles.optionRow}>
                {durationOpts.map((o) => (
                  <label
                    key={o.id}
                    className={`${styles.pill} ${
                      form.duration === o.id ? styles.pillActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={ids.duration}
                      value={o.id}
                      checked={form.duration === o.id}
                      onChange={() =>
                        setField(
                          'duration',
                          o.id as FormState['duration'],
                        )
                      }
                      className={styles.optionInput}
                      aria-required="true"
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              {errors.duration && (
                <p
                  id={`${ids.duration}-err`}
                  className={styles.error}
                  role="alert"
                >
                  {errors.duration}
                </p>
              )}
            </fieldset>

            <BrushDivider tone="light" width={64} />

            {/* 同行人 */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>同行人</legend>
              <div className={styles.optionRow}>
                {companionOpts.map((o) => (
                  <label
                    key={o.id}
                    className={`${styles.pill} ${
                      form.companions === o.id ? styles.pillActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={ids.companions}
                      value={o.id}
                      checked={form.companions === o.id}
                      onChange={() => setField('companions', o.id)}
                      className={styles.optionInput}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <BrushDivider tone="light" width={64} />

            {/* 兴趣 */}
            <fieldset
              className={styles.fieldset}
              aria-invalid={!!errors.interests}
              aria-describedby={errors.interests ? `${ids.interests}-err` : undefined}
            >
              <legend className={styles.legend}>
                兴趣偏好
                <span className={styles.required} aria-hidden="true">
                  *
                </span>
              </legend>
              <p className={`${styles.hint} font-data`}>
                多选；至少选择一项
              </p>
              <div className={styles.optionGrid}>
                {interestOpts.map((o) => {
                  const active = form.interests.includes(o.id);
                  return (
                    <label
                      key={o.id}
                      className={`${styles.option} ${active ? styles.optionActive : ''}`}
                    >
                      <input
                        type="checkbox"
                        value={o.id}
                        checked={active}
                        onChange={() => toggleInterest(o.id)}
                        className={styles.optionInput}
                        aria-required="true"
                      />
                      <span className={styles.optionText}>
                        <span className={styles.optionLabel}>{o.label}</span>
                      </span>
                      {active && (
                        <span className={styles.optionMark} aria-hidden="true">
                          ●
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              {errors.interests && (
                <p
                  id={`${ids.interests}-err`}
                  className={styles.error}
                  role="alert"
                >
                  {errors.interests}
                </p>
              )}
            </fieldset>

            <BrushDivider tone="light" width={64} />

            {/* 交通方式 */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>交通方式</legend>
              <div className={styles.optionRow}>
                {transportOpts.map((o) => (
                  <label
                    key={o.id}
                    className={`${styles.pill} ${
                      form.transportMode === o.id ? styles.pillActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={ids.transportMode}
                      value={o.id}
                      checked={form.transportMode === o.id}
                      onChange={() => setField('transportMode', o.id)}
                      className={styles.optionInput}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              {showTransportNote && transportOption?.note && (
                <p className={styles.notice} role="note">
                  {transportOption.note}
                </p>
              )}
            </fieldset>

            <BrushDivider tone="light" width={64} />

            {/* 节奏 */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>游玩节奏</legend>
              <div className={styles.optionRow}>
                {paceOpts.map((o) => (
                  <label
                    key={o.id}
                    className={`${styles.pill} ${
                      form.pace === o.id ? styles.pillActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={ids.pace}
                      value={o.id}
                      checked={form.pace === o.id}
                      onChange={() => setField('pace', o.id)}
                      className={styles.optionInput}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <BrushDivider tone="light" width={64} />

            {/* 补充说明 */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>补充说明</legend>
              <p className={`${styles.hint} font-data`}>
                例如：想看夜景 / 老人 / 室内为主 / 想多拍照
              </p>
              <textarea
                id={ids.notes}
                className={styles.textarea}
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
                rows={3}
                placeholder="第一版仅做关键词匹配（夜景 / 老人 / 室内 / 美食 / 水乡 / 拍照 / 艺术等）"
              />
            </fieldset>

            <div className={styles.actions}>
              <InkButton type="submit" variant="primary" size="large">
                为我画一卷
              </InkButton>
              <InkButton
                type="reset"
                variant="ghost"
                size="medium"
                onClick={handleReset}
              >
                清空
              </InkButton>
            </div>
          </form>
        </ScrollReveal>

        {/* 推荐结果 */}
        {result && (
          <div id="draw-result" className={styles.result}>
            <ItineraryResult result={result} onReset={handleReset} />
          </div>
        )}
      </div>
    </section>
  );
}