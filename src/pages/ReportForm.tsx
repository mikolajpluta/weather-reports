import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { weatherReportFormSchema, weatherReportFormData } from '../types/weatherReportFormSchema';
import { addNewReport, fetchReportById, updateReport } from '../services/api';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

const ReportForm: React.FC = () => {
    const [successInfo, setSuccessInfo] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, control, setValue, formState: {errors}, reset} = useForm<weatherReportFormData>({
        resolver: zodResolver(weatherReportFormSchema),
        defaultValues: { date: format(new Date(), 'yyyy-MM-dd') }
    });

    useEffect(() => {
        if (successInfo) {
            setTimeout(() => {setSuccessInfo(false)}, 2000);
        }
    }, [successInfo])

    useEffect(() => {
        if (id) {
            const fetchReport = async () => {
                try {
                    const data = await fetchReportById(id);
                    setValue('city', data.city);
                    setValue('temperature', data.temperature);
                    setValue('unit', data.unit);
                    setValue('date', data.date);
                } catch (error) {
                    setFetchError("Błąd przy pobieraniu raportu");
                }
            }
            fetchReport();
        }
    }, [id, setValue]);

    const onSubmit = async (data: weatherReportFormData) => {
        try {
            if (id) {
                await updateReport(id, data);
                setTimeout(() => navigate("/"), 2000);
                setSuccessInfo(true);
            } else {
                await addNewReport(data);
                reset();
                setSuccessInfo(true);
            }
        } catch (error) {
            console.log(error);
            setFetchError("Wystąpił błąd przy wysyłaniu formularza.")
        }
    }

    if (fetchError){
        return (<div className='error'>{fetchError}</div>)
    }

    return (
        <>
        <h2>{id ? 'Edytuj raport meteorologiczny' : 'Dodaj nowy raport meteorologiczny'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className='input-wrapper'>
                <label htmlFor='city'>Miasto</label>
                <input id='city' type='text' {...register('city')}></input>
                {errors.city && <p>{errors.city.message}</p>}
            </div>

            <div className='input-wrapper'>
                <label htmlFor="temperature">Temperatura</label>
                <input id="temperature" type="number" {...register('temperature', { valueAsNumber: true })} />
                {errors.temperature && <p>{errors.temperature.message}</p>}
            </div>

            <div className='input-wrapper'>
                <label htmlFor="unit">Jednostka</label>
                <select id="unit" {...register('unit')}>
                    <option value="C">Celsius</option>
                    <option value="K">Kelvin</option>
                    <option value="F">Fahrenheit</option>
                </select>
                {errors.unit && <p>{errors.unit.message}</p>}
            </div>

            <div className='datepickerContaier'>
                <label htmlFor="date">Data</label>
                <Controller
                    control={control}
                    name="date"
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            selected={value ? new Date(value) : null}
                            onChange={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Wybierz datę"
                        />
                    )}
                />
                {errors.date && <p>{errors.date.message}</p>}
            </div>

            <button type="submit">{id ? 'Edytuj raport': 'Dodaj raport'}</button>

        </form>

        {successInfo && (
            <div className='successInfo'>{id ? 'Pomyślnie edytowano raport.': 'Pomyślnie dodano nowy raport.'}</div>
        )}
        </>
    )
}

export default ReportForm;