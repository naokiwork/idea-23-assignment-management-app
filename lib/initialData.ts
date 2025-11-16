/**
 * 初期データ構造
 * アプリ起動時やデータリセット時に使用
 */

import type { BackupData } from './types';

/**
 * 空の初期データ構造を返す
 * @returns 空のデータ構造
 */
export function createInitialData(): BackupData {
  return {
    subjects: [],
    timetables: [],
    classes: [],
    tasks: [],
    subtasks: [],
    studyLogs: [],
    exams: [],
    version: '0.1.0',
    exportedAt: new Date().toISOString(),
  };
}

/**
 * テスト用のサンプルデータを返す
 * @returns サンプルデータ
 */
export function createSampleData(): BackupData {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return {
    subjects: [
      {
        id: 'subj-1',
        name: '数学',
        teacher: '山田先生',
        year: '2024',
        semester: '前期',
      },
      {
        id: 'subj-2',
        name: '英語',
        teacher: '佐藤先生',
        year: '2024',
        semester: '前期',
      },
    ],
    timetables: [
      {
        id: 'tt-1',
        subjectId: 'subj-1',
        dayOfWeek: 'monday',
        period: 1,
        startDate: '2024-04-01',
      },
      {
        id: 'tt-2',
        subjectId: 'subj-2',
        dayOfWeek: 'tuesday',
        period: 2,
        startDate: '2024-04-01',
      },
    ],
    classes: [
      {
        id: 'class-1',
        subjectId: 'subj-1',
        date: '2024-04-08',
        time: '09:00',
        title: '微分積分の基礎',
      },
    ],
    tasks: [
      {
        id: 'task-1',
        subjectId: 'subj-1',
        relatedClassId: 'class-1',
        taskType: 'assignment',
        title: '数学の宿題',
        deadline: tomorrow.toISOString().split('T')[0],
        requiredStudyAmount: '2時間',
      },
      {
        id: 'task-2',
        subjectId: 'subj-2',
        taskType: 'review',
        title: '英語の復習',
        deadline: nextWeek.toISOString().split('T')[0],
      },
    ],
    subtasks: [
      {
        id: 'st-1',
        parentTaskId: 'task-1',
        name: '問題1-10を解く',
        status: 'completed',
      },
      {
        id: 'st-2',
        parentTaskId: 'task-1',
        name: '問題11-20を解く',
        status: 'in_progress',
      },
    ],
    studyLogs: [
      {
        id: 'log-1',
        date: now.toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        taskId: 'task-1',
        content: '数学の宿題を進めた',
        progressAmount: '50%',
      },
    ],
    exams: [
      {
        id: 'exam-1',
        subjectId: 'subj-1',
        name: '中間テスト',
        date: nextWeek.toISOString().split('T')[0],
        testRange: '第1章〜第3章',
      },
    ],
    version: '0.1.0',
    exportedAt: now.toISOString(),
  };
}

