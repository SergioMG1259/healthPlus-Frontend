import { Directive, ElementRef, Host, Input, Optional, Renderer2, Self } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith } from 'rxjs';

@Directive({
  selector: '[appCustomPaginator]'
})
export class CustomPaginatorDirective {

  pagesContainerRef!:HTMLElement
  buttonsRef: HTMLElement[] = []
  dotsStartRef!: HTMLElement
  dotsEndRef!: HTMLElement
  @Input() appCustomLength: number = 0;

  constructor(@Host() @Self() @Optional() private matPaginator:MatPaginator, 
  private elementRef: ElementRef, private ren:Renderer2) { }

  private styleDefaultPagination() {
    const nativeElement = this.elementRef.nativeElement

    const itemsPerPage = nativeElement.querySelector(
      '.mat-paginator-page-size'
    );
    const howManyDisplayedEl = nativeElement.querySelector(
      '.mat-paginator-range-label'
    );

    // quitar 'items per page'
    this.ren.setStyle(itemsPerPage, 'display', 'none')

    this.ren.setStyle(howManyDisplayedEl, 'position', 'absolute')
    this.ren.setStyle(howManyDisplayedEl, 'left', '16px')
    this.ren.setStyle(howManyDisplayedEl, 'color', '#616161')
    this.ren.setStyle(howManyDisplayedEl, 'font-size', '14px')
  }

  private createPagesDivRef(): void {
    const actionContainer = this.elementRef.nativeElement.querySelector(
      'div.mat-paginator-range-actions'
    )
    const nextButtonDefault = this.elementRef.nativeElement.querySelector(
      'button.mat-paginator-navigation-next'
    )

    // crear un HTML element donde todas las páginas serán renderizadas
    this.pagesContainerRef = this.ren.createElement('div') as HTMLElement
    this.ren.addClass(this.pagesContainerRef, 'pages-container')

    // renderizar elemento antes de que se muestre el 'botón siguiente'
    this.ren.insertBefore(
      actionContainer,
      this.pagesContainerRef,
      nextButtonDefault
    )
  }

  private buildButtons(): void {
    const neededButtons = Math.ceil(
      this.appCustomLength / this.matPaginator.pageSize
    );

    // si solo hay una página, no se debe mostrar los botones
    if (neededButtons == 1) {
      this.ren.setStyle(this.elementRef.nativeElement, 'display', 'none');
      return;
    }

    // crear el primer botón
    this.buttonsRef = [this.createButton(0)];

    // agregar los dots
    this.dotsStartRef = this.createDotsButton();

    // crear todos los botones, excepto el primero y el último
    for (let index = 1; index < neededButtons - 1; index++) {
      this.buttonsRef = [...this.buttonsRef, this.createButton(index)];
    }

    // agregar los dots
    this.dotsEndRef = this.createDotsButton();

    // crear el último botón después de los puntos (....)
    this.buttonsRef = [...this.buttonsRef, this.createButton(neededButtons - 1),
    ];

  }

  private createButton(i: number): HTMLElement {
    const pageButton = this.ren.createElement('button')
    const text = this.ren.createText(String(i + 1))

    // agrega la clase y el texto
    this.ren.addClass(pageButton, 'custom-page')
    // this.ren.setStyle(pageButton, 'margin-right', '8px')
    this.ren.appendChild(pageButton, text)

    // evento click
    this.ren.listen(pageButton, 'click', () => {
      this.switchPage(i)
    });

    // renderizar el boton
    this.ren.appendChild(this.pagesContainerRef, pageButton)

    // por defecto, el botón está oculto
    this.ren.setStyle(pageButton, 'display', 'none')

    return pageButton;
  }

  private createDotsButton(): HTMLElement {
    const pageButton = this.ren.createElement('div')
    const text = this.ren.createText('...')

    // agrega la clase y el texto
    this.ren.addClass(pageButton, 'custom-dots')
    // this.ren.setStyle(pageButton, 'margin-right', '8px')
    this.ren.appendChild(pageButton, text)

    // renderizar el boton
    this.ren.appendChild(this.pagesContainerRef, pageButton)

    // por defecto, el botón está oculto
    this.ren.setStyle(pageButton, 'display', 'none')

    return pageButton
  }

  private switchPage(i: number): void {
    const previousPageIndex = this.matPaginator.pageIndex
    this.matPaginator.pageIndex = i
    this.matPaginator['_emitPageEvent'](previousPageIndex) // se emite el evento de cambio de página
  }

  private changeActiveButtonStyles(previousIndex: number, newIndex: number): void {
    const previouslyActive = this.buttonsRef[previousIndex]
    const currentActive = this.buttonsRef[newIndex]

    // quitar estilo active del botón previo activo
    this.ren.removeClass(previouslyActive, 'page-active')

    // agregar estilo active al nuevo botón activo
    this.ren.addClass(currentActive, 'page-active')

    // ocultar todos los botones
    this.buttonsRef.forEach((button) =>
      this.ren.setStyle(button, 'display', 'none')
    )

    // mostrar 2 botones previos y 2 botones posteriores al activo
    const renderElements = 2;
    const startDots = newIndex - renderElements - 1 > 0
    const endDots = newIndex < this.buttonsRef.length -1 - renderElements - 1 
    const firstButton = this.buttonsRef[0]
    const lastButton = this.buttonsRef[this.buttonsRef.length - 1]

    // mostrar el último botón y los últimos dots si cumplen la condición
    this.ren.setStyle(this.dotsEndRef, 'display', endDots ? 'inline-block' : 'none')
    this.ren.setStyle(lastButton, 'display', endDots ? 'inline-block' : 'none')

    // mostrar el primer botón y los primeros dots si cumplen la condición
    this.ren.setStyle(this.dotsStartRef, 'display', startDots ? 'inline-block' : 'none')
    this.ren.setStyle(firstButton, 'display', startDots ? 'inline-block' : 'none')

    // índice inicial y final para mostrar botones
    const startingIndex = startDots ? newIndex - renderElements : 0
    const endingIndex = endDots ? newIndex + renderElements: this.buttonsRef.length - 1

    // mostrar los botones dentro del rango
    for (let i = startingIndex; i <= endingIndex; i++) {
      const button = this.buttonsRef[i]
      this.ren.setStyle(button, 'display', 'inline-block')
    }
  }

  ngAfterViewInit(): void {
    this.styleDefaultPagination()
    this.createPagesDivRef()
    this.buildButtons()
    this.matPaginator.page.pipe(
      map((e) => [e.previousPageIndex?? 0, e.pageIndex]),
      startWith([this.matPaginator.pageIndex, this.matPaginator.pageIndex])
    )
    .subscribe(([prev,current]) => {this.changeActiveButtonStyles(prev,current)})
  }

}