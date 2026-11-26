import { router } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';
import type { FlashToast } from '@/types/ui';

export function initializeFlashToast(): void {
    router.on('flash', (event) => {
        const flash = (event as CustomEvent).detail?.flash;
        const data = flash?.toast as FlashToast | undefined;

        if (!data) {
            return;
        }

        toast[data.type](data.message);
    });

    router.on('success', (event) => {
        const pageProps = (
            event as CustomEvent<{
                page?: {
                    props?: {
                        flash?: {
                            success?: string | null;
                            error?: string | null;
                            warning?: string | null;
                            info?: string | null;
                        };
                    };
                };
            }>
        ).detail?.page?.props?.flash;

        if (!pageProps) {
            return;
        }

        if (pageProps.success) {
            toast.success(pageProps.success);
        }
        if (pageProps.error) {
            toast.error(pageProps.error);
        }
        if (pageProps.warning) {
            toast.warning(pageProps.warning);
        }
        if (pageProps.info) {
            toast.info(pageProps.info);
        }
    });
}
