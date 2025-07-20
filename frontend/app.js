// YHWH Knowledge Base JavaScript
class KnowledgeBase {
    constructor() {
        this.baseURL = 'http://localhost:8000';
        this.currentCategory = null;
        this.data = {};
        this.searchIndex = [];
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadInitialData();
        this.setupSearch();
    }

    bindEvents() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadInitialData();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
    }

    async loadInitialData() {
        this.showLoading(true);
        try {
            await Promise.all([
                this.loadCategories(),
                this.loadUpdates(),
                this.loadAllData()
            ]);
        } catch (error) {
            this.showError('Failed to load data: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async loadCategories() {
        try {
            const response = await fetch(`${this.baseURL}/api/categories`);
            const data = await response.json();
            this.renderCategories(data.categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async loadUpdates() {
        try {
            const response = await fetch(`${this.baseURL}/api/updates`);
            const data = await response.json();
            this.renderUpdates(data.updates);
        } catch (error) {
            console.error('Error loading updates:', error);
        }
    }

    async loadAllData() {
        try {
            const response = await fetch(`${this.baseURL}/api/data`);
            this.data = await response.json();
            this.buildSearchIndex();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    renderCategories(categories) {
        const container = document.getElementById('categoriesNav');
        container.innerHTML = categories.map(category => `
            <a href="#" 
               class="sidebar-item flex items-center px-4 py-3 text-gray-700 rounded-lg group"
               data-category="${category.id}">
                <span class="text-xl mr-3 group-hover:scale-110 transition-transform">${category.icon}</span>
                <span class="font-medium">${category.name}</span>
            </a>
        `).join('');

        // Bind click events
        container.querySelectorAll('[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.currentTarget.dataset.category;
                this.loadCategory(category);
                this.setActiveCategory(e.currentTarget);
            });
        });
    }

    renderUpdates(updates) {
        const container = document.getElementById('updatesContainer');
        container.innerHTML = updates.slice(0, 3).map(update => {
            const priorityColor = {
                high: 'bg-red-100 text-red-800 border-red-200',
                medium: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
                low: 'bg-green-100 text-green-800 border-green-200'
            }[update.priority] || 'bg-gray-100 text-gray-800 border-gray-200';

            return `
                <div class="border-l-4 border-accent-blue pl-4">
                    <div class="flex items-center justify-between mb-1">
                        <h4 class="text-sm font-semibold text-gray-800 line-clamp-1">${update.title}</h4>
                        <span class="px-2 py-1 text-xs rounded-full ${priorityColor} border">
                            ${update.priority}
                        </span>
                    </div>
                    <p class="text-xs text-liquid-800 mb-2 line-clamp-2">${update.description}</p>
                    <span class="text-xs text-liquid-600">${this.formatDate(update.date)}</span>
                </div>
            `;
        }).join('');
    }

    async loadCategory(categoryId) {
        this.showLoading(true);
        this.currentCategory = categoryId;
        
        try {
            const response = await fetch(`${this.baseURL}/api/${categoryId}`);
            const data = await response.json();
            this.renderCategoryContent(categoryId, data);
            this.showContent();
        } catch (error) {
            this.showError(`Failed to load ${categoryId}: ` + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    renderCategoryContent(categoryId, data) {
        const container = document.getElementById('contentContainer');
        let content = '';

        switch (categoryId) {
            case 'appointments':
                content = this.renderAppointments(data);
                break;
            case 'information':
                content = this.renderInformation(data);
                break;
            case 'staff':
                content = this.renderStaff(data);
                break;
            case 'insurance':
                content = this.renderInsurance(data);
                break;
            case 'callflow':
                content = this.renderCallflow(data);
                break;
            default:
                content = this.renderGeneric(data);
        }

        container.innerHTML = `<div class="content-fade-in">${content}</div>`;
    }

    renderAppointments(data) {
        if (!data.AppointmentGuide?.visit_types) return '<p>No appointment data available</p>';

        const visitTypes = data.AppointmentGuide.visit_types;
        return `
            <div class="mb-8">
                <h2 class="text-3xl font-poppins font-bold text-gray-900 mb-6 flex items-center">
                    <span class="text-4xl mr-4">📅</span>
                    Appointment Guide
                </h2>
                <div class="grid gap-6">
                    ${visitTypes.map(visit => `
                        <div class="glass-effect rounded-xl p-6 hover-lift border border-liquid-300">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-xl font-semibold text-gray-900">${visit.visit_type}</h3>
                                <span class="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-sm font-medium">
                                    ${visit.duration}
                                </span>
                            </div>
                            <p class="text-liquid-800 mb-4">${visit.description}</p>
                            ${visit.extra_info ? `<div class="mb-4">
                                <h4 class="font-medium text-gray-800 mb-2">Additional Information:</h4>
                                <p class="text-liquid-700 bg-liquid-100 p-3 rounded-lg">${visit.extra_info}</p>
                            </div>` : ''}
                            ${visit.rules ? `<div>
                                <h4 class="font-medium text-gray-800 mb-2">Rules:</h4>
                                <p class="text-liquid-700 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">${visit.rules}</p>
                            </div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderInformation(data) {
        if (!data.Information) return '<p>No information data available</p>';

        const info = data.Information;
        let content = `
            <div class="mb-8">
                <h2 class="text-3xl font-poppins font-bold text-gray-900 mb-6 flex items-center">
                    <span class="text-4xl mr-4">ℹ️</span>
                    General Information
                </h2>
                <div class="space-y-8">
        `;

        // Forms section
        if (info.Complaints || info.SickAndPainForm || info.Cancelations) {
            content += `
                <div class="glass-effect rounded-xl p-6 border border-liquid-300">
                    <h3 class="text-2xl font-semibold text-gray-900 mb-4">Quick Forms</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        ${info.Complaints ? `
                            <a href="${info.Complaints.google_form_link}" target="_blank" 
                               class="block p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                                <div class="text-2xl mb-2">📝</div>
                                <h4 class="font-semibold text-red-800">Complaints</h4>
                                <p class="text-red-600 text-sm mt-1">${info.Complaints.description}</p>
                            </a>
                        ` : ''}
                        ${info.SickAndPainForm ? `
                            <a href="${info.SickAndPainForm.google_form_link}" target="_blank"
                               class="block p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                                <div class="text-2xl mb-2">🤒</div>
                                <h4 class="font-semibold text-yellow-800">Sick & Pain</h4>
                                <p class="text-yellow-600 text-sm mt-1">${info.SickAndPainForm.description}</p>
                            </a>
                        ` : ''}
                        ${info.Cancelations ? `
                            <a href="${info.Cancelations.google_form_link}" target="_blank"
                               class="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                                <div class="text-2xl mb-2">❌</div>
                                <h4 class="font-semibold text-blue-800">Cancelations</h4>
                                <p class="text-blue-600 text-sm mt-1">${info.Cancelations.description}</p>
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // HIPAA section
        if (info.HIPAA_Basics) {
            const hipaa = info.HIPAA_Basics;
            content += `
                <div class="glass-effect rounded-xl p-6 border border-liquid-300">
                    <h3 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span class="text-2xl mr-3">🔒</span>
                        HIPAA Guidelines
                    </h3>
                    ${hipaa.hipaa_overview ? `
                        <div class="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                            <p class="text-blue-800">${hipaa.hipaa_overview.description}</p>
                        </div>
                    ` : ''}
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        ${hipaa.key_principles ? `
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-3">Key Principles</h4>
                                <div class="space-y-3">
                                    ${hipaa.key_principles.map(principle => `
                                        <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <h5 class="font-medium text-green-800">${principle.principle}</h5>
                                            <p class="text-green-700 text-sm mt-1">${principle.description}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div>
                            ${hipaa.staff_responsibilities ? `
                                <div class="mb-6">
                                    <h4 class="font-semibold text-gray-800 mb-3">Staff Responsibilities</h4>
                                    <div class="space-y-2">
                                        ${hipaa.staff_responsibilities.map(resp => `
                                            <div class="flex items-start">
                                                <span class="text-green-500 mr-2 mt-1">✓</span>
                                                <span class="text-liquid-800 text-sm">${resp}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${hipaa.common_violations ? `
                                <div>
                                    <h4 class="font-semibold text-gray-800 mb-3">Common Violations</h4>
                                    <div class="space-y-2">
                                        ${hipaa.common_violations.map(violation => `
                                            <div class="flex items-start">
                                                <span class="text-red-500 mr-2 mt-1">⚠️</span>
                                                <span class="text-liquid-800 text-sm">${violation}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        // Prescriptions section
        if (info.Common_Prescriptions?.prescriptions) {
            content += `
                <div class="glass-effect rounded-xl p-6 border border-liquid-300">
                    <h3 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span class="text-2xl mr-3">💊</span>
                        Common Prescriptions
                    </h3>
                    <div class="grid gap-4">
                        ${info.Common_Prescriptions.prescriptions.map(med => `
                            <div class="p-4 bg-liquid-50 border border-liquid-200 rounded-lg hover:bg-liquid-100 transition-colors">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-semibold text-gray-900">${med.name}</h4>
                                    <span class="px-2 py-1 bg-accent-purple/10 text-accent-purple text-xs rounded-full">
                                        ${med.class}
                                    </span>
                                </div>
                                <p class="text-accent-blue font-medium text-sm mb-2">${med.indication}</p>
                                <p class="text-liquid-800 text-sm">${med.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        content += '</div></div>';
        return content;
    }

    renderStaff(data) {
        if (!data.StaffExtensions) return '<p>No staff data available</p>';

        return `
            <div class="mb-8">
                <h2 class="text-3xl font-poppins font-bold text-gray-900 mb-6 flex items-center">
                    <span class="text-4xl mr-4">👥</span>
                    Staff Extensions
                </h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${data.StaffExtensions.map(staff => `
                        <div class="glass-effect rounded-xl p-4 hover-lift border border-liquid-300">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 bg-gradient-to-r from-accent-blue to-accent-green rounded-full flex items-center justify-center mr-3">
                                        <span class="text-white font-semibold">${staff.Staff.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900 text-sm">${staff.Staff}</h3>
                                        <p class="text-liquid-600 text-xs">Extension</p>
                                    </div>
                                </div>
                                <span class="text-2xl font-bold text-accent-blue">${staff.Ext}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderInsurance(data) {
        if (!data.InsurancePortals?.accepted_insurances) return '<p>No insurance data available</p>';

        return `
            <div class="mb-8">
                <h2 class="text-3xl font-poppins font-bold text-gray-900 mb-6 flex items-center">
                    <span class="text-4xl mr-4">🏥</span>
                    Insurance Portals
                </h2>
                <div class="grid gap-6">
                    ${data.InsurancePortals.accepted_insurances.map(insurance => `
                        <div class="glass-effect rounded-xl p-6 hover-lift border border-liquid-300">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-xl font-semibold text-gray-900">${insurance.insurance_name}</h3>
                                <div class="flex items-center space-x-2">
                                    ${insurance.pcp_change_required ? 
                                        '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">PCP Required</span>' : 
                                        '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">No PCP Required</span>'
                                    }
                                </div>
                            </div>
                            <div class="mb-4">
                                <p class="text-liquid-800 mb-2">
                                    <span class="font-medium">Portal:</span> ${insurance.portal_name}
                                </p>
                                <a href="${insurance.website}" target="_blank" 
                                   class="text-accent-blue hover:text-accent-blue/80 underline">
                                    ${insurance.website}
                                </a>
                            </div>
                            ${insurance.notes ? `
                                <div class="bg-liquid-50 p-3 rounded-lg border-l-4 border-accent-blue">
                                    <p class="text-liquid-800 text-sm">${insurance.notes}</p>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderCallflow(data) {
        return `
            <div class="mb-8">
                <h2 class="text-3xl font-poppins font-bold text-gray-900 mb-6 flex items-center">
                    <span class="text-4xl mr-4">📞</span>
                    Call Flow Information
                </h2>
                <div class="glass-effect rounded-xl p-6 border border-liquid-300">
                    <pre class="bg-liquid-50 p-4 rounded-lg overflow-x-auto text-sm text-liquid-900">${JSON.stringify(data, null, 2)}</pre>
                </div>
            </div>
        `;
    }

    renderGeneric(data) {
        return `
            <div class="mb-8">
                <h2 class="text-3xl font-poppins font-bold text-gray-900 mb-6">Data View</h2>
                <div class="glass-effect rounded-xl p-6 border border-liquid-300">
                    <pre class="bg-liquid-50 p-4 rounded-lg overflow-x-auto text-sm text-liquid-900">${JSON.stringify(data, null, 2)}</pre>
                </div>
            </div>
        `;
    }

    setActiveCategory(element) {
        // Remove active class from all categories
        document.querySelectorAll('[data-category]').forEach(item => {
            item.classList.remove('bg-accent-blue/10', 'border-l-4', 'border-accent-blue', 'text-accent-blue');
        });

        // Add active class to current category
        element.classList.add('bg-accent-blue/10', 'border-l-4', 'border-accent-blue', 'text-accent-blue');
    }

    buildSearchIndex() {
        this.searchIndex = [];
        
        Object.keys(this.data).forEach(category => {
            const categoryData = this.data[category];
            this.indexDataRecursively(categoryData, category);
        });
    }

    indexDataRecursively(obj, category, path = '') {
        if (typeof obj === 'string') {
            this.searchIndex.push({
                content: obj,
                category: category,
                path: path
            });
        } else if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                this.indexDataRecursively(item, category, `${path}[${index}]`);
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
                this.indexDataRecursively(obj[key], category, path ? `${path}.${key}` : key);
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            this.showWelcome();
            return;
        }

        const results = this.searchIndex.filter(item => 
            item.content.toLowerCase().includes(query.toLowerCase())
        );

        this.renderSearchResults(query, results);
        this.showContent();
    }

    renderSearchResults(query, results) {
        const container = document.getElementById('contentContainer');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="content-fade-in text-center py-16">
                    <div class="text-6xl mb-4">🔍</div>
                    <h2 class="text-2xl font-poppins font-bold text-gray-900 mb-4">No Results Found</h2>
                    <p class="text-liquid-800">No results found for "${query}". Try different keywords.</p>
                </div>
            `;
            return;
        }

        const resultsByCategory = results.reduce((acc, result) => {
            if (!acc[result.category]) acc[result.category] = [];
            acc[result.category].push(result);
            return acc;
        }, {});

        const content = `
            <div class="content-fade-in">
                <div class="mb-8">
                    <h2 class="text-3xl font-poppins font-bold text-gray-900 mb-4 flex items-center">
                        <span class="text-4xl mr-4">🔍</span>
                        Search Results
                    </h2>
                    <p class="text-liquid-800 mb-6">Found ${results.length} results for "${query}"</p>
                    
                    ${Object.keys(resultsByCategory).map(category => `
                        <div class="mb-8">
                            <h3 class="text-xl font-semibold text-gray-900 mb-4 capitalize">${category}</h3>
                            <div class="space-y-4">
                                ${resultsByCategory[category].slice(0, 5).map(result => `
                                    <div class="glass-effect rounded-lg p-4 hover-lift border border-liquid-300">
                                        <div class="flex justify-between items-start mb-2">
                                            <span class="text-sm text-liquid-600">${result.path}</span>
                                            <span class="px-2 py-1 bg-accent-blue/10 text-accent-blue text-xs rounded-full capitalize">${category}</span>
                                        </div>
                                        <p class="text-liquid-800">${this.highlightSearchTerm(result.content, query)}</p>
                                    </div>
                                `).join('')}
                                ${resultsByCategory[category].length > 5 ? `
                                    <p class="text-liquid-600 text-sm">... and ${resultsByCategory[category].length - 5} more results</p>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = content;
    }

    highlightSearchTerm(text, term) {
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    }

    showWelcome() {
        document.getElementById('welcomeSection').classList.remove('hidden');
        document.getElementById('contentContainer').classList.add('hidden');
    }

    showContent() {
        document.getElementById('welcomeSection').classList.add('hidden');
        document.getElementById('contentContainer').classList.remove('hidden');
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }

    showError(message) {
        // You could implement a toast notification here
        console.error(message);
        alert(message);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short', 
            day: 'numeric'
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new KnowledgeBase();
});
