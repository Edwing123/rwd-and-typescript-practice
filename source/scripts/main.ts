function toggleSettings(event: MouseEvent): void {
  const settings = document.getElementById("settings")
  // const buttonEl = event.target
  let areSettingActive: string = settings.dataset.settingsActive

  if (areSettingActive === "true") {
    settings.classList.remove("settings--open")
    settings.dataset.settingsActive = "false"
  } else {
    settings.classList.add("settings--open")
    settings.dataset.settingsActive = "true"
  }

  event.stopPropagation()
}

function closeSettings(): void {
    const settings = document.getElementById("settings")
    let areSettingActive: string = settings.dataset.settingsActive

    if (areSettingActive === "true") {
      settings.classList.remove("settings--open")
      settings.dataset.settingsActive = "false"
    }
}

function createEmployeeProfile(employee: IEmployee): string {
  let {
    employee_name: name,
    profile_image: image,
    employee_age: age,
    employee_salary: salary,
    id
  } = employee
  const imageSrc: string =  image !== "" ? image : `/dist/images/user.svg`

  const employeeEl: string = `
  <div itemscope itemtype="https://schema.org/Person" class="employee" id="${id}" data-employee-id="${id}">
    <div class="employee__body">
      <img class="employee__image" src="${imageSrc}" alt="${name}" />
      <h4 class="employee__name" itemprop="name">${name}</h4>
      <section class="employee__information">
      <span class="employee__informationData" itemprop="age">Age ${age}</span>
      <span class="employee__informationData" itemprop="salary">Salary ${salary}</span>
      </section>
    </div>
  </div>
  `


  // attaching
  return employeeEl
}

function setEmployees(employees: Array<IEmployee>) {
  const employeesContainer = document.getElementById("employees__container")
  const employeesProfiles = employees.reduce((employees: string, employee: IEmployee) => employees += createEmployeeProfile(employee), "")
  employeesContainer.innerHTML = ""
  // let delay: number = 20

  // employees.forEach((employee: IEmployee) => {
  //   (function(container: HTMLElement, delay: number) {
  //     setTimeout(() => {
  //       const employeeProfile: string = createEmployeeProfile(employee)
  //       container.innerHTML += employeeProfile
  //     }, delay)
  //   })(employeesContainer, delay)
  // })
  employeesContainer.innerHTML = employeesProfiles
}

function toggleNavigation(event: MouseEvent) {
  const navigationMenu = document.getElementById("navigation")
  // const buttonEl = event.target
  let isNavigationActive: string = navigationMenu.dataset.navigationActive

  if (isNavigationActive === "true") {
    navigationMenu.classList.remove("navigation--open")
    navigationMenu.dataset.navigationActive = "false"
  } else {
    navigationMenu.classList.add("navigation--open")
    navigationMenu.dataset.navigationActive = "true"
  }

  event.stopPropagation()
}

function closeNavigation(): void {
  const navigationMenu = document.getElementById("navigation")
  // const buttonEl = event.target
  let isNavigationActive: string = navigationMenu.dataset.navigationActive

  if (isNavigationActive === "true") {
    navigationMenu.classList.remove("navigation--open")
    navigationMenu.dataset.navigationActive = "false"
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const toggleSettingsButton = document.getElementById("toggleSettings")
  const closeSettingsButton = document.getElementById("closeSettings")
  const progressBar = document.getElementById("employees__progress__loader")
  const settings = document.getElementById("settings")
  const menuButton = document.getElementById("menuButton")
  const navigationMenu = document.getElementById("navigation")
  const navigationLinks = document.getElementsByClassName("navigation__link")

  // attaching event listeners
  toggleSettingsButton.addEventListener("click", toggleSettings)
  closeSettingsButton.addEventListener("click", closeSettings)
  settings.addEventListener("click", (event: MouseEvent) => event.stopPropagation())
  document.addEventListener("click", closeSettings)

  menuButton.addEventListener("click", toggleNavigation)
  navigationMenu.addEventListener("click", (event: MouseEvent) => event.stopPropagation())
  toggleSettingsButton.addEventListener("click", closeNavigation)
  settings.addEventListener("click", closeNavigation)
  document.addEventListener("click", closeNavigation)


  const api: API = new API()
  // api.http.interceptors.request.use((config) => {
  //   console.log(config)
  //   return config
  // })
  // api.http.interceptors.response.use((response) => {
  //   console.log(response)
  //   return response
  // })

  const employees = api.getEmployess()

  employees
    .then((employees: Array<IEmployee>) => {
      setEmployees(employees)
    })
    .finally(() => {
      progressBar.value = 1
      setTimeout(() => {
        progressBar.setAttribute("class", "employees__progress__loader--hidden")
      }, 1000)
    })
})


// ok ...
class API {
  endpoints = {
    employess: "http://dummy.restapiexample.com/api/v1/employees"
  }
  http = axios.create()

  getEmployess() {
    const self = this
    let { endpoints: { employess }, http } = self

    return new Promise((resolve, reject) => {
      http.get(employess)
        .then((response) => {
          let employess = response.data.data
          resolve(employess)
        })
        .catch((error) => reject(error))
    })
  }
}


interface IEmployee {
  id: string,
  employee_name: string,
  employee_salary: string,
  employee_age: string,
  profile_image: string,
}
