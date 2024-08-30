import { ComponentRef, forwardRef, useMemo, useState, useEffect } from 'react';
import { Select, SelectProps } from 'antd';
import { fetchSettings } from '@/app/lib/actions';
import { Setting, SETTINGS_TYPE } from '@/app/lib/definitions';

export interface SettingSelectProps extends Omit<SelectProps, 'options' | 'loading'> {
	type: SETTINGS_TYPE;
}

export type SettingSelectRef = ComponentRef<typeof Select>;

export const SettingSelect = forwardRef<SettingSelectRef, SettingSelectProps>((props, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState([])

	useEffect(() => {
		getData();
	}, []);

    const getData = async () => {
        setSettings(
            await fetchSettings(props.type)
        );
        setIsLoading(false);
    };

	const options = useMemo<SelectProps['options']>(
		() => (settings as Setting[]).map((item) => ({ value: item.label, label: item.label })),
		[settings]
	);

	return (
		<Select
			ref={ref}
			{...props}
			showSearch
			loading={isLoading}
			optionFilterProp='label'
			options={options}
		/>
	);
});