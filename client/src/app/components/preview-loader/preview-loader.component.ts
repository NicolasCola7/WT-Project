// preview-loader.component.ts
import { Component, Input, ViewChild, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Type } from '@angular/core';

@Component({
  selector: 'app-preview-loader',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-container #previewContainer></ng-container>'
})
export class PreviewLoaderComponent implements OnChanges {
  @Input() componentLoader!: () => Promise<Type<any>>;
  @Input() data: any;
  
  @ViewChild('previewContainer', { read: ViewContainerRef, static: true }) 
  previewContainer!: ViewContainerRef;
  
  private currentComponentRef: any = null;
  private isLoading = false;
  
  async ngOnChanges(changes: SimpleChanges) {
    // Carica il componente solo se ci sono stati cambiamenti effettivi
    // e non stiamo già caricando
    if ((changes['componentLoader'] || changes['data']) && !this.isLoading) {
      await this.loadComponent();
    }
  }
  
  async loadComponent() {
    // Evita caricamenti multipli simultanei
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      // Pulisci il container prima di aggiungere un nuovo componente
      this.previewContainer.clear();
      
      if (this.componentLoader) {
        // Carica il componente dinamicamente
        const componentType = await this.componentLoader();
        
        // Crea il componente
        const componentRef = this.previewContainer.createComponent(componentType);
        
        // Passa i dati al componente
        if (this.data) {
          (componentRef.instance as any).data = this.data;
        }
        
        // Imposta la modalità preview = true quando viene caricato nel preview-loader
        (componentRef.instance as any).isPreviewMode = true;
        
        // Salva il riferimento per la pulizia
        if (this.currentComponentRef) {
          this.currentComponentRef.destroy();
        }
        this.currentComponentRef = componentRef;
      }
    } catch (error) {
      console.error('Errore nel caricamento del componente:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  ngOnDestroy() {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
    }
  }
}