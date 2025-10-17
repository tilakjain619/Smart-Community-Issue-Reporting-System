import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const IssueChart = ({ issues }) => {
  // Process data for Issues by Category chart
  const categoryData = useMemo(() => {
    const categoryCount = {};
    issues.forEach(issue => {
      const category = issue.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const categories = Object.keys(categoryCount);
    const counts = Object.values(categoryCount);

    return {
      labels: categories,
      datasets: [
        {
          label: 'Issues by Category',
          data: counts,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
            '#4BC0C0',
            '#FF6384'
          ],
          borderColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
            '#4BC0C0',
            '#FF6384'
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [issues]);

  // Process data for Monthly Reports Trend
  const monthlyTrendData = useMemo(() => {
    const monthlyCount = {};
    
    issues.forEach(issue => {
      const date = new Date(issue.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCount[monthYear] = (monthlyCount[monthYear] || 0) + 1;
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyCount).sort();
    const counts = sortedMonths.map(month => monthlyCount[month]);

    // Format labels for better display
    const formattedLabels = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(year, monthNum - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    return {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Monthly Reports',
          data: counts,
          borderColor: '#ff9a47',
          backgroundColor: 'rgba(255, 154, 71, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ff9a47',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  }, [issues]);

  // Status distribution data
  const statusData = useMemo(() => {
    const statusCount = {
      'open': 0,
      'in progress': 0,
      'pending': 0,
      'closed': 0,
      'resolved': 0
    };

    issues.forEach(issue => {
      const status = issue.status || 'open';
      if (statusCount.hasOwnProperty(status)) {
        statusCount[status]++;
      }
    });

    return {
      labels: Object.keys(statusCount).map(status => status.charAt(0).toUpperCase() + status.slice(1)),
      datasets: [
        {
          label: 'Issues by Status',
          data: Object.values(statusCount),
          backgroundColor: [
            '#ef4444', // red for open
            '#3b82f6', // blue for in progress
            '#f59e0b', // amber for pending
            '#6b7280', // gray for closed
            '#10b981', // green for resolved
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [issues]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#ff9a47',
        borderWidth: 1,
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#ff9a47',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Categories</p>
              <p className="text-3xl font-bold">{Object.keys(categoryData.labels || {}).length}</p>
            </div>
            <PieChart className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issues by Category - Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">Issues by Category</h3>
          </div>
          <div className="h-80">
            <Bar data={categoryData} options={barOptions} />
          </div>
        </div>

        {/* Issues by Status - Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-800">Issues by Status</h3>
          </div>
          <div className="h-80">
            <Pie data={statusData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Monthly Trend - Full Width */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-semibold text-gray-800">Monthly Reports Trend</h3>
        </div>
        <div className="h-80">
          <Line data={monthlyTrendData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default IssueChart;
