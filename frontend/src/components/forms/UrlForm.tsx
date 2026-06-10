import { useState, type ChangeEvent } from 'react';
import { Input } from 'reactstrap';

import { buttonSize, buttonStyle } from '../../constants/constants';
import { ArticleSchema } from '../../constants/schema';
import { UrlFormProps } from '../../constants/types';
import PopupWrapper from '../features/PopupWrapper';

const UrlOnlySchema = ArticleSchema.pick({ url: true });

function UrlForm({ isOpen, toggle, onSave, title }: Readonly<UrlFormProps>) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | undefined>();
  const inputClassName =
    'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400';

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    setUrl(e.currentTarget.value);
    setError(undefined);
  }

  function validateForm(): void {
    const result = UrlOnlySchema.safeParse({ url });

    if (result.success) {
      setError(undefined);
      onSave(result.data.url);
      return;
    }

    const issue = result.error.issues.find((i) => i.path[0] === 'url');
    setError(issue?.message?.trim() ? issue.message : 'Invalid URL');
  }

  return (
    <PopupWrapper popup={isOpen} setPopup={toggle} status="neutral">
      <div className="article-form flex w-100 flex-col space-y-8">
        <h1 className="text-center text-3xl font-bold dark:text-white">{title}</h1>
        <form>
          <div>
            <label htmlFor="url" className="text-slate-800 dark:text-slate-100">
              <b>Url</b>
            </label>
            <Input
              type="url"
              name="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={handleChange}
              className={inputClassName}
              invalid={error !== undefined}
            />
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        </form>
        <div className="flex w-full justify-center">
          <button type="button" className={`${buttonStyle.success} ${buttonSize.medium}`} onClick={validateForm}>
            Save
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}

export default UrlForm;
