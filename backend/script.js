const sensors = [
    {
        type: "Temperature & Humidity",
        model: "SHT35 (Sensirion)",
        cost: 8000,
        radius: 50,
        category: "Premium",
        features: "High accuracy, long-term stability, fast response"
    },
    {
        type: "Temperature & Humidity",
        model: "HMP60 (Vaisala)",
        cost: 20000,
        radius: 100,
        category: "High-end",
        features: "Reliable industrial-grade sensor"
    },
    {
        type: "Temperature & Humidity",
        model: "EE220 (E+E Elektronik)",
        cost: 35000,
        radius: 150,
        category: "Enterprise",
        features: "Advanced monitoring with high precision"
    },
    {
        type: "Soil Moisture",
        model: "SM150T (Delta-T Devices)",
        cost: 10000,
        radius: 30,
        category: "Premium",
        features: "Precise volumetric water content measurement"
    },
    {
        type: "Soil Moisture",
        model: "GS1 (METER Group)",
        cost: 25000,
        radius: 50,
        category: "High-end",
        features: "Long-term stability and robust performance"
    },
    {
        type: "Soil Moisture",
        model: "TDR-315 (Acclima)",
        cost: 40000,
        radius: 80,
        category: "Enterprise",
        features: "High accuracy for agricultural applications"
    },
    {
        type: "NPK Sensor",
        model: "Apogee GS3",
        cost: 12000,
        radius: 20,
        category: "Premium",
        features: "Measures EC, temperature, and moisture"
    },
    {
        type: "NPK Sensor",
        model: "Spectrum FieldScout SC900",
        cost: 30000,
        radius: 40,
        category: "High-end",
        features: "Accurate nutrient level analysis"
    },
    {
        type: "NPK Sensor",
        model: "GroPoint Profile",
        cost: 50000,
        radius: 70,
        category: "Enterprise",
        features: "Multi-depth NPK analysis for large farms"
    }
];

function calculatePricing() {
    const farmArea = parseFloat(document.getElementById('farmArea').value);
    if (!farmArea || farmArea <= 0) {
        alert('Please enter a valid farm area');
        return;
    }

    const categories = ['Premium', 'High-end', 'Enterprise'];
    const packages = categories.map(category => calculatePackage(farmArea, category));
    
    const bestPackage = findBestValue(packages);
    
    displayResults(packages, bestPackage.category);
    document.getElementById('results').style.display = 'block';
}

function calculatePackage(area, category) {
    const categorySensors = sensors.filter(s => s.category === category);
    const sensorRequirements = {};
    let totalCost = 0;

    categorySensors.forEach(sensor => {
        const sensorArea = Math.PI * Math.pow(sensor.radius, 2);
        const unitsNeeded = Math.ceil(area / sensorArea);
        
        sensorRequirements[sensor.type] = {
            model: sensor.model,
            units: unitsNeeded,
            costPerUnit: sensor.cost,
            totalCost: unitsNeeded * sensor.cost
        };
        
        totalCost += sensorRequirements[sensor.type].totalCost;
    });

    const installationCost = calculateInstallationCost(area, category);
    totalCost += installationCost;

    return {
        category,
        requirements: sensorRequirements,
        totalCost,
        installationCost
    };
}

function calculateInstallationCost(area, category) {
    const baseInstallationCost = {
        'Premium': 15000,
        'High-end': 30000,
        'Enterprise': 50000
    }[category];
    
    return Math.round(baseInstallationCost * Math.sqrt(area / 10000));
}

function findBestValue(packages) {
    return packages.reduce((best, current) => {
        const currentRatio = current.totalCost;
        const bestRatio = best ? best.totalCost : Infinity;
        return currentRatio < bestRatio ? current : best;
    });
}

function displayResults(packages, bestCategory) {
    const container = document.querySelector('.pricing-cards');
    container.innerHTML = '';

    packages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = `pricing-card ${pkg.category === bestCategory ? 'recommended' : ''}`;

        const features = {
            'Premium': [
                "Basic monitoring capabilities",
                "Email support",
                "Standard installation",
                "3 months warranty"
            ],
            'High-end': [
                "Advanced monitoring features",
                "Priority support",
                "Professional installation",
                "1 year warranty"
            ],
            'Enterprise': [
                "Full monitoring suite",
                "24/7 dedicated support",
                "Expert installation & calibration",
                "2 year warranty"
            ]
        }[pkg.category];

        card.innerHTML = `
            ${pkg.category === bestCategory ? '<div class="recommendation-tag">BEST VALUE</div>' : ''}
            <div class="package-name">${pkg.category} Package</div>
            <div class="price">₹${pkg.totalCost.toLocaleString('en-IN')}</div>
            <div class="package-summary">
                Installation Cost: ₹${pkg.installationCost.toLocaleString('en-IN')}
            </div>
            <ul>
                ${features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>`;

        container.appendChild(card);
    });

    displaySensorDetails(packages.find(p => p.category === bestCategory));
}

function displaySensorDetails(package) {
    const tbody = document.getElementById('sensorDetailsBody');
    tbody.innerHTML = '';

    Object.entries(package.requirements).forEach(([type, details]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${type}</td>
            <td>${details.model}</td>
            <td>${details.units} units</td>
            <td>₹${details.costPerUnit.toLocaleString('en-IN')}</td>
            <td>₹${details.totalCost.toLocaleString('en-IN')}</td>
        `;
        tbody.appendChild(row);
    });
}