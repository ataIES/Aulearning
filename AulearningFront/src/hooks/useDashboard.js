import { useEffect, useState } from 'react';

import { useUI } from './useUI';

export default function useDashboard(loader) {

    const { setLoading, showError } = useUI();

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        const load = async () => {

            try {

                setLoading(true);

                const response = await loader();

                setDashboard(response.data);

            } catch {

                showError(
                    'No se pudo cargar el dashboard.'
                );

            } finally {

                setLoading(false);

            }

        };

        load();

    }, []);

    return dashboard;

}