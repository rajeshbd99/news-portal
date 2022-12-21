const loadData = async () => {
    try {
        const res = await fetch("https://openapi.programming-hero.com/api/news/categories");
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }

}

const categories = async () => {
    try {
        const data = await loadData();
        const categories = data.data.news_category;
        const categorieContainer = document.getElementById("category-container");
        categories.forEach(category => {
            const { category_name, category_id } = category;
            const li = document.createElement("li");
            li.classList.add("nav-item", "category");
            li.innerHTML = `
    <a onclick="news(${category_id},this)" class="nav-link" aria-current="page" href="#">${category_name}</a>
    `;
            categorieContainer.appendChild(li);
        })
        const categoryList = document.getElementsByClassName("category");
        activeCategory(categoryList);

    }
    catch (error) {
        console.log(error);
    }
}
categories();

const spinner = (isLoading) => {
    const loader = document.getElementById("loader");
    if (isLoading) {
        loader.classList.remove("d-none");
    }
    else {
        loader.classList.add("d-none");
    }
}

const activeCategory = (categoryList) => {
    const defaultCategory = categoryList[0].children[0];
    defaultCategory.classList.add("text-danger", "fw-semibold");
    let previous = "";
    for (const category of categoryList) {

        category.addEventListener("click", (event) => {
            defaultCategory.classList.remove("text-danger", "fw-semibold");
            if (previous ? previous.classList.remove("text-danger", "fw-semibold") : "");
            event.target.classList.add("text-danger", "fw-semibold");
            previous = event.target;
        })
    }

}

const news = async (id = 01, event) => {
    try {
        spinner(true);
        const res = await fetch(`https://openapi.programming-hero.com/api/news/category/0${id}`);
        const data = await res.json();
        const newses = data.data;
        const itemCounter = document.getElementById("item-count");
        itemCounter.innerHTML = `
        <h6>${newses.length > 0 ? newses.length : "No"} items found for category ${event ? event.innerText : "Breaking News"}</h6>
    `;
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "";
        newses.sort((a, b) => {
            return b.total_view - a.total_view;
        })
        newses.forEach(news => {
            const { thumbnail_url, title, details, author, total_view, _id } = news;
            const div = document.createElement("div");
            div.classList.add("card", "mb-3", "p-md-3");
            div.innerHTML = `
            <div class="row g-0">
            <div class="col-lg-3 col-md-4">
                <img src="${thumbnail_url}" class="img-fluid rounded-start h-100 w-sm-0 w-100" alt="...">
            </div>
            <div class="col-lg-9 col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text text-muted">${details.slice(0, 250)}.<br><br><span class="d-md-block d-none">${details.slice(250, 400) + "..."}</p>
                    <div class="row d-flex justify-content-between align-items-center gy-3 gy-md-0">
                        <div class="col-md-5 col-12 d-flex align-items-center">
                            <img class="rounded-circle me-2" src="${author.img}" height="50px" width="50px">
                            <div>
                                <small class="fw-semibold">${author.name ? author.name : "Not available"}</small><br>
                                <small>${author.published_date ? author.published_date : "Not avilable"}</small>
                            </div>
                        </div>
                        <div class="col-md-2 col-12">
                        <span class="fw-bold"><i class="fa-regular fa-eye me-1"></i>${total_view ? total_view : "0"}M</span>
                        </div>
                        <div class="col-md-3 col-12">
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <div class="col-md-2 col-12 d-flex  justify-content-center">
                        <i onclick="newsDetail('${_id}')" class="fa-solid fa-arrow-right fs-4" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
            newsContainer.appendChild(div);
        });
        spinner(false);
    }
    catch (error) {
        console.log(error);
    }
}
news();

const newsDetail = async (id) => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/news/${id}`);
        const data = await res.json();
        const detailsNews = data.data[0];
        console.log(detailsNews);
        const { details, title, author, rating } = detailsNews;
        const modalBody = document.getElementById("modal-body");
        modalBody.innerHTML = `
        <div class="card border-info mb-3">
        <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${details}</p>
        <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center me-2">
        <img class="rounded-circle me-2" src="${author.img}" height="50px" width="50px">
        <div>
            <small class="fw-semibold">${author.name ? author.name : "Not available"}</small><br>
            <small>${author.published_date ? author.published_date : "Not avilable"}</small>
        </div>
        </div>
         <div>
            <p>Rating: <span class="text-primary me-5">${rating.number}</span></p>
         </div>
        </div>
        </div>
    `;
    }
    catch (error) {
        console.log(error);
    }
}

