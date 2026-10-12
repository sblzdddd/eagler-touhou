import {useSyncExternalStore} from 'react';
import logoMarkup from './thsss-load-logo.svg?raw';
import './download-stage.css';
import type {BrowserSession} from '../../session/browser-session';
import type {TransferSnapshot} from '../../models/transfer';
import {useLocale} from '../../i18n';
import {useSurfaceNavigation} from '../../navigation/surface-navigation';

function ratioOf(state: TransferSnapshot) {
  if (state.fileBytesTotal > 0) {
    const extra = state.activeTotal > 0 ? Math.min(state.activeLoaded, state.activeTotal) : 0;
    return Math.min(1, (state.fileBytesLoaded + extra) / state.fileBytesTotal);
  }
  if (state.fileTotal > 0) return Math.min(1, state.fileLoaded / state.fileTotal);
  const width = /^([\d.]+)%$/.exec(state.barWidth);
  if (width && !state.indeterminate) return Math.min(1, Number(width[1]) / 100);
  return 0;
}

/** Centered download progress for the blank Runtime iframe. The game page
 * replaces it once the Runtime document navigates. */
export function DownloadStage({session}: {session: BrowserSession}) {
  const {t} = useLocale(), navigation = useSurfaceNavigation();
  const state = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
  const transfer = useSyncExternalStore(session.transfer.subscribe, session.transfer.getSnapshot, session.transfer.getSnapshot);
  const settings = useSyncExternalStore(session.settings.subscribe, session.settings.getSnapshot, session.settings.getSnapshot);
  const runtime = state.runtime;
  const downloading = !transfer.hidden || runtime?.phase === 'loading' || (transfer.fileTotal > 0 && transfer.fileLoaded < transfer.fileTotal);
  if (!state.playerOpen || navigation.surface === 'touch' || runtime?.source || runtime?.launched || !downloading) return null;
  const files = transfer.fileTotal > 0;
  const left = files ? Math.max(0, transfer.fileTotal - transfer.fileLoaded) : 0;
  const amount = /^([\d.]+)\s*\/\s*([\d.]+)\s*MiB$/.exec(transfer.amount);
  const lines = files
    ? [t('load.progress', {loaded: transfer.fileLoaded, total: transfer.fileTotal}), t('load.remaining', {left}),
      transfer.fileName ? t('load.current', {name: transfer.fileName}) : transfer.fileLoaded >= transfer.fileTotal ? t('load.booting') : t('load.starting')]
    : amount
      ? [t('load.progress', {loaded: `${Number(amount[1]).toFixed(1)} MiB`, total: `${Number(amount[2]).toFixed(1)} MiB`}),
        t('load.remaining', {left: `${Math.max(0, Number(amount[2]) - Number(amount[1])).toFixed(1)} MiB`}),
        transfer.label ? t('load.current', {name: transfer.label}) : t('load.starting')]
      : [transfer.title || t('load.starting'), transfer.amount, transfer.label ? t('load.current', {name: transfer.label}) : t('load.starting')];
  const game = runtime?.game ?? settings?.gameId;
  return <div className="load-stage" role="status">
    {game === 'thsss' ? <div className="load-stage-logo" aria-hidden="true" style={{clipPath: `inset(0 0 ${(1 - ratioOf(transfer)) * 100}% 0)`}} dangerouslySetInnerHTML={{__html: logoMarkup}}/> : null}
    <p className="load-stage-text">{lines.join('\n')}</p>
  </div>;
}
