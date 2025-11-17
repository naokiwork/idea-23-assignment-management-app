/**
 * 学習タスク管理アプリ - データモデル型定義
 * 仕様書 v0.2 の2章に基づく
 */

// タスク種別
export type TaskType = 'preparation' | 'review' | 'assignment' | 'exam_study';

// サブタスクの状態
export type SubtaskStatus = 'not_started' | 'in_progress' | 'completed';

// 曜日
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * 2.1 科目（Subject）
 */
export interface Subject {
  id: string;
  name: string;
  teacher?: string;
  year?: string;
  semester?: string;
}

/**
 * 2.2 時間割（Timetable）
 */
export interface Timetable {
  id: string;
  subjectId: string;
  dayOfWeek: DayOfWeek;
  period: number; // 時限（1限、2限など）
  startDate?: string; // ISO 8601形式の日付文字列
}

/**
 * 2.3 授業回（Class / Lesson）
 */
export interface Class {
  id: string;
  subjectId: string;
  date: string; // ISO 8601形式の日付文字列
  time?: string; // 時刻（例: "14:00"）
  title: string;
}

/**
 * 2.5 タスク（Task）
 */
export interface Task {
  id: string;
  subjectId: string;
  relatedClassId?: string; // 関連授業ID
  relatedExamId?: string; // 関連テストID（テスト勉強の場合）
  taskType: TaskType;
  title: string;
  deadline: string; // ISO 8601形式の日付文字列
  requiredStudyAmount?: string; // 必要学習量（任意）
}

/**
 * 2.6 サブタスク（Subtask）
 */
export interface Subtask {
  id: string;
  parentTaskId: string;
  name: string;
  status: SubtaskStatus;
}

/**
 * 2.7 学習ログ（Study Log）
 */
export interface StudyLog {
  id: string;
  date: string; // ISO 8601形式の日付文字列
  startTime?: string; // 開始時刻（例: "14:00"）
  endTime?: string; // 終了時刻（例: "16:00"）
  taskId: string;
  content: string; // 実施内容
  progressAmount?: string; // 進捗量（任意）
}

/**
 * 2.8 テスト（Exam）
 */
export interface Exam {
  id: string;
  subjectId: string;
  name: string;
  date: string; // ISO 8601形式の日付文字列
  testRange?: string; // テスト範囲（任意）
}

/**
 * 学習リソース（Learning Resource）
 */
export interface LearningResource {
  id: string;
  title: string;
  description?: string;
  url?: string;
  type: 'book' | 'video' | 'article' | 'website' | 'other';
  subjectIds?: string[]; // 関連科目ID
  taskTypeIds?: TaskType[]; // 関連タスク種別
  tags?: string[];
  rating?: number; // 評価（1-5）
  createdAt: string; // ISO 8601形式の日付文字列
  updatedAt?: string; // ISO 8601形式の日付文字列
}

/**
 * 2.10 科目テンプレート（Subject Template）
 */
export interface SubjectTemplate {
  subjectName: string;
  dayOfWeek: DayOfWeek;
  period: number;
  month?: number;
  day?: number;
  preparationTemplate?: string;
  reviewTemplate?: string;
  assignmentTemplate?: string;
}

/**
 * 2.9 バックアップデータ（Backup）
 * すべてのデータを1つの構造で保存
 */
export interface BackupData {
  subjects: Subject[];
  timetables: Timetable[];
  classes: Class[];
  tasks: Task[];
  subtasks: Subtask[];
  studyLogs: StudyLog[];
  exams: Exam[];
  learningResources?: LearningResource[];
  // メタデータ
  version: string;
  exportedAt: string; // ISO 8601形式の日付文字列
}

