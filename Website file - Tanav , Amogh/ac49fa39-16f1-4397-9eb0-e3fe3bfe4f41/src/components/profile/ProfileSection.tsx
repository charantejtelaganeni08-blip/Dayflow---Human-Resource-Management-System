import { useEffect, useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';

export interface ProfileField {
  key: string;
  label: string;
  value: string;
  editable: boolean;
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea';
  options?: string[];
}

interface ProfileSectionProps {
  title: string;
  description?: string;
  fields: ProfileField[];
  onSave: (values: Record<string, string>) => void;
}

export function ProfileSection({ title, description, fields, onSave }: ProfileSectionProps) {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const signature = fields.map((field) => `${field.key}:${field.value}`).join('|');

  useEffect(() => {
    setDraft(Object.fromEntries(fields.map((field) => [field.key, field.value])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const dirty = fields.some((field) => draft[field.key] !== undefined && draft[field.key] !== field.value);
  const anyEditable = fields.some((field) => field.editable);

  return (
    <Panel
      title={title}
      description={description}
      action={
      anyEditable &&
      <div className="flex items-center gap-2">
            {saved && !dirty &&
        <span className="inline-flex items-center gap-1 text-xs text-green-700">
                <CheckIcon className="h-3.5 w-3.5" />
                Saved
              </span>
        }
            <Button
          size="sm"
          disabled={!dirty}
          onClick={() => {
            onSave(draft);
            setSaved(true);
          }}>
          
              Save
            </Button>
          </div>

      }>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) =>
        <Field
          key={field.key}
          label={field.label}
          htmlFor={`profile-${field.key}`}
          locked={!field.editable}
          className={field.type === 'textarea' ? 'sm:col-span-2' : undefined}>
          
            {!field.editable ?
          <p className="flex h-10 items-center rounded-lg bg-slate-50 px-3 text-sm text-ink">
                {field.value || '—'}
              </p> :
          field.type === 'textarea' ?
          <textarea
            id={`profile-${field.key}`}
            rows={2}
            className={`${inputClass} h-auto py-2`}
            value={draft[field.key] ?? ''}
            onChange={(event) => {
              setSaved(false);
              setDraft((current) => ({ ...current, [field.key]: event.target.value }));
            }} /> :

          field.options ?
          <select
            id={`profile-${field.key}`}
            className={inputClass}
            value={draft[field.key] ?? ''}
            onChange={(event) => {
              setSaved(false);
              setDraft((current) => ({ ...current, [field.key]: event.target.value }));
            }}>
            
                {field.options.map((option) =>
            <option key={option} value={option}>
                    {option}
                  </option>
            )}
              </select> :

          <input
            id={`profile-${field.key}`}
            type={field.type ?? 'text'}
            className={inputClass}
            value={draft[field.key] ?? ''}
            onChange={(event) => {
              setSaved(false);
              setDraft((current) => ({ ...current, [field.key]: event.target.value }));
            }} />

          }
          </Field>
        )}
      </div>
    </Panel>);

}