document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch the YAML file
    const response = await fetch('project-data.yaml');
    const yamlText = await response.text();
    
    // Parse YAML
    const data = jsyaml.load(yamlText);
    
    // Set title and description
    document.getElementById('project-title').textContent = data.title;
    document.getElementById('project-description').textContent = data.description;
    
    // Apply custom theme colors if provided
    if (data.theme) {
      const heroSection = document.querySelector('.hero');
      if (data.theme.headerBackground) {
        heroSection.style.backgroundColor = data.theme.headerBackground;
        // Remove the default Bulma class
        heroSection.classList.remove('is-primary');
      }
      
      if (data.theme.headerText) {
        // Apply text color to all text elements in the header
        const titleElement = document.getElementById('project-title');
        const descriptionElement = document.getElementById('project-description');
        
        titleElement.style.color = data.theme.headerText;
        descriptionElement.style.color = data.theme.headerText;
      }
    }
    
    // Populate released versions
    const releasedVersionsContainer = document.getElementById('released-versions');
    data.releasedVersions.forEach(version => {
      const versionElement = document.createElement('div');
      versionElement.className = 'version-item mb-3';
      
      // Create a link for the version
      const versionLink = document.createElement('a');
      versionLink.href = version.url;
      versionLink.className = 'mr-2';
      
      const versionName = document.createElement('span');
      versionName.className = 'tag is-medium';
      versionName.textContent = version.version;
      
      // Apply custom version tag colors if provided in theme
      if (data.theme) {
        if (data.theme.versionBackground) {
          versionName.style.backgroundColor = data.theme.versionBackground;
        } else {
          versionName.classList.add('is-primary'); // Default Bulma class if no custom color
        }
        
        if (data.theme.versionText) {
          versionName.style.color = data.theme.versionText;
        }
      } else {
        versionName.classList.add('is-primary'); // Default Bulma class if no theme
      }
      
      versionLink.appendChild(versionName);
      
      const versionDate = document.createElement('span');
      versionDate.className = 'is-size-7';
      
      // Format date to display only the date part (YYYY-MM-DD)
      let formattedDate = version.date;
      if (version.date instanceof Date) {
        formattedDate = version.date.toISOString().split('T')[0];
      } else if (typeof version.date === 'string' && version.date.includes('T')) {
        formattedDate = version.date.split('T')[0];
      }
      
      versionDate.textContent = `Released: ${formattedDate}`;
      
      versionElement.appendChild(versionLink);
      versionElement.appendChild(versionDate);
      releasedVersionsContainer.appendChild(versionElement);
    });
    
    // Populate development versions
    const devVersionsContainer = document.getElementById('dev-versions');
    data.developmentVersions.forEach(version => {
      const versionElement = document.createElement('div');
      versionElement.className = 'version-item mb-3';
      
      const versionLink = document.createElement('a');
      versionLink.href = version.url;
      versionLink.className = 'button is-info is-outlined is-small';
      versionLink.textContent = version.name;
      
      versionElement.appendChild(versionLink);
      devVersionsContainer.appendChild(versionElement);
    });
    
  } catch (error) {
    console.error('Error loading project data:', error);
    document.body.innerHTML = `<div class="notification is-danger">
      <p>Error loading project data: ${error.message}</p>
    </div>`;
  }
});