import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import type { ErrorPageRouteConfig } from '@core/models/error-page.model';
import { resolveErrorPage } from '@core/utils/error-page.util';
import { ErrorPanel } from '@shared/organisms/error-panel/error-panel';

@Component({
  standalone: true,
  imports: [ErrorPanel],
  selector: 'app-tailwind-error-page',
  templateUrl: './error-page.html',
})
export class TailwindErrorPage {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });

  protected readonly error = computed(() =>
    resolveErrorPage(
      this.params().get('code'),
      this.data()['errorPage'] as ErrorPageRouteConfig | undefined,
    ),
  );
}
