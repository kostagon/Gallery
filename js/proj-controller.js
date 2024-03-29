'use strict';

function initPage() {
  var projects = getProjects();
  var strHtml = projects.map(function (proj) {
    return `<div class="col-md-4 col-sm-6 portfolio-item" onclick="renderModal(${proj.id})">
              <a class="portfolio-link" data-toggle="modal" href="#portfolioModal">
                <div class="portfolio-hover">
                  <div class="portfolio-hover-content">
                     <i class="fa fa-plus fa-3x"></i>
                  </div>
                </div>
                <img class="img-fluid" src="${proj.url}${proj.thumbnail}" alt="">
              </a>
                      <div class="portfolio-caption">
                        <h4>${proj.title}</h4>
                        <p class="text-muted">${proj.desc}</p>
                      </div>
                    </div>`;
  })
  var elContainer = document.querySelector('.proj-generator');
  elContainer.innerHTML += strHtml.join('');
}

function sendMail() {
  var mail = document.querySelector('#form-email').value;
  var subject = document.querySelector('#form-subject').value;
  var msg = document.querySelector('#form-msg').value;
  if(!mail || !subject || !msg) return;
  window.location = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=contact.kostagon@gmail.com&su=${subject}&body=${msg}`;
}

function renderModal(id) {
  var projects = getProjects();
  var proj = projects[id];
  var strHtml = `<h2>${proj.name}</h2>
                <p class="item-intro text-muted">by Kosta Goncharov</p>
                <img class="img-fluid d-block mx-auto" src="${proj.url}${proj.thumbnail}" alt="">
                <p>${proj.name} - Everybody loves ${proj.name}</p>
                <ul class="list-inline">
                  <li>Date: 2019</li>
                </ul>
                <a href="${proj.url}" class="btn btn-success" target="_blank">
                  <i class="fa fa-times"></i>
                  Check my game!</a>
                  <button class="btn btn-primary" data-dismiss="modal" type="button">
                  <i class="fa fa-times"></i>
                  Close Project</button>`;
  var elModal = document.querySelector('.modal-body');
  elModal.innerHTML = strHtml;
}