import { WeatherReport } from "../types/weatherReport";
import { useState, useEffect } from "react";
import { fetchWeatherReports } from "../services/api";
import { toKelvin } from "../services/temperatureConversion";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ReportList: React.FC = () => {
    const [reports, setReports] = useState<WeatherReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<string>('city');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [cityFilter, setCityFilter] = useState<string>('');
    
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await fetchWeatherReports();
                setReports(data);
                setLoading(false);
            } catch (error) {
                setError('Błąd podczas pobierania raportów: ' + error);
                setLoading(false);
            }
        }

        fetchReports();
    }, [])

    const sortReports = (field: string, order: 'asc' | 'desc') => {
      setSortBy(field);
      setSortOrder(order);

      const sortedReports = [...reports].sort((a, b) => {
          if (order === 'asc') {
              if (field === 'temperature') {
                  return a.temperature - b.temperature;
              } else if (field === 'date') {
                  return new Date(a.date).getTime() - new Date(b.date).getTime();
              } else {
                  return a.city.localeCompare(b.city);
              }
          } else {
              if (field === 'temperature') {
                  return b.temperature - a.temperature;
              } else if (field === 'date') {
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
              } else {
                  return b.city.localeCompare(a.city);
              }
          }
      });
      setReports(sortedReports);
    }

    const filteredReports = reports.filter((report) => {
      return report.city.toLowerCase().includes(cityFilter.toLowerCase());
    });
 
    if (loading) {
        return <div className="loading">Ładowanie</div>
    }

    if (error) {
        return <div className="error">{error}</div>
    }

    return (
      <div>
        <h2>Lista Raportów</h2>

        <div className="filterBox">
          <div>
            <label>Sortuj po:</label>
            <select
                value={sortBy}
                onChange={(e) => sortReports(e.target.value, sortOrder)}
            >
                <option value="city">Miasto</option>
                <option value="temperature">Temperatura</option>
                <option value="date">Data</option>
            </select>
          </div>

          <div>
            <label>Kierunek sortowania:</label>
            <select
                value={sortOrder}
                onChange={(e) => sortReports(sortBy, e.target.value as 'asc' | 'desc')}
            >
                <option value="asc">Rosnąco</option>
                <option value="desc">Malejąco</option>
            </select>
          </div>

          <div>
            <label>Filtruj po mieście:</label>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Wpisz nazwę miasta"
            />
          </div>
        </div>

        <div className="tableWrapper">
          <div className="header">
            <div>Miasto</div>
            <div>Temperatura</div>
            <div>Jednostka</div>
            <div>Data</div>
            <div></div>
          </div>

          <div className="table">
            {filteredReports.map((report, index) => (
              <motion.div
              key={report.id}
              className="record"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                opacity: { delay: index * 0.05, duration: 0.5 },
              }}
            >

                  <div className="cell">{report.city}</div>
                  <div className="cell">{toKelvin(report.temperature, report.unit)}°</div>
                  <div className="cell">K</div>
                  <div className="cell">{report.date}</div>
                  <div className="cell"><button onClick={() => navigate(`/add-report/${report.id}`)}>edit</button></div>

              </motion.div>
            ))}
          </div>
        </div>
    </div>
    )

}

export default ReportList;