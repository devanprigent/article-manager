import { useState, type ChangeEvent } from 'react';
import { Input } from 'reactstrap';

import { buttonSize, buttonStyle } from '../../constants/constants';
import PopupWrapper from '../../core/components/PopupWrapper';
import { RssFeedInputSchema } from '../../types/schema';
import type { RssFeedInput } from '../../types/types';

interface FormProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (feed: RssFeedInput) => void;
  isPending?: boolean;
}

type FieldErrors = Partial<Record<keyof RssFeedInput, string>>;

const emptyFeed: RssFeedInput = { site_name: '', site_url: '', site_rss_feed: '' };

const fields: { name: keyof RssFeedInput; label: string; type: 'text' | 'url'; placeholder: string }[] = [
  { name: 'site_name', label: 'Name', type: 'text', placeholder: 'Example Blog' },
  { name: 'site_url', label: 'Website', type: 'url', placeholder: 'https://example.com' },
  { name: 'site_rss_feed', label: 'RSS feed', type: 'url', placeholder: 'https://example.com/feed.xml' },
];

const inputClassName =
  'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400';

function RssFeedForm({ isOpen, toggle, onSave, isPending = false }: Readonly<FormProps>) {
  const [feed, setFeed] = useState<RssFeedInput>(emptyFeed);
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.currentTarget;
    setFeed({ ...feed, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  }

  function validateForm(): void {
    const result = RssFeedInputSchema.safeParse(feed);

    if (result.success) {
      setErrors({});
      onSave(result.data);
      return;
    }

    const fieldErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof RssFeedInput;
      fieldErrors[field] ??= issue.message;
    }
    setErrors(fieldErrors);
  }

  return (
    <PopupWrapper popup={isOpen} setPopup={toggle} status="neutral">
      <div className="article-form flex w-100 flex-col space-y-8">
        <h1 className="text-center text-3xl font-bold dark:text-white">Add an RSS feed</h1>
        <form className="flex flex-col gap-4">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label htmlFor={name} className="text-slate-800 dark:text-slate-100">
                <b>{label}</b>
              </label>
              <Input
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                value={feed[name]}
                onChange={handleChange}
                className={inputClassName}
                invalid={errors[name] !== undefined}
              />
              {errors[name] && <div className="text-sm text-red-500">{errors[name]}</div>}
            </div>
          ))}
        </form>
        <div className="flex w-full justify-center">
          <button type="button" className={`${buttonStyle.success} ${buttonSize.medium}`} onClick={validateForm} disabled={isPending}>
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}

export default RssFeedForm;
