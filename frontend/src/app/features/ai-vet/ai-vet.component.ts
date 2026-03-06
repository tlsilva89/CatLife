import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AiVetService } from '../../core/services/ai-vet.service';
import { CatService } from '../../core/services/cat.service';
import { ToastService } from '../../core/services/toast.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-ai-vet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MarkdownModule],
  templateUrl: './ai-vet.component.html'
})
export class AiVetComponent implements OnInit {
  private fb = inject(FormBuilder);
  private aiVetService = inject(AiVetService);
  private catService = inject(CatService);
  private toast = inject(ToastService);

  cats = signal<any[]>([]);
  aiResponse = signal<string | null>(null);
  currentChatId = signal<string | null>(null);
  isLoadingAi = signal<boolean>(false);
  isLoadingTelegram = signal<boolean>(false);

  consultForm = this.fb.group({
    catId: ['', Validators.required],
    symptoms: ['', [Validators.required, Validators.minLength(10)]]
  });

  telegramForm = this.fb.group({
    chatId: ['', Validators.required]
  });

  ngOnInit() {
    this.catService.getCats().subscribe((data: any[]) => {
      this.cats.set(data);
      if (data.length > 0) {
        this.consultForm.patchValue({ catId: data[0].id.toString() });
      }
    });

    this.loadTelegramLink();
  }

  async loadTelegramLink() {
    try {
      const data: any = await this.aiVetService.getTelegramLink();
      if (data?.myTelegramLink?.chatId) {
        this.currentChatId.set(data.myTelegramLink.chatId);
        this.telegramForm.patchValue({ chatId: data.myTelegramLink.chatId });
      }
    } catch (error) {
    }
  }

  async onConsultSubmit() {
    if (this.consultForm.valid) {
      try {
        this.isLoadingAi.set(true);
        this.aiResponse.set(null);
        
        const { catId, symptoms } = this.consultForm.value;
        const result: any = await this.aiVetService.consult(Number(catId), symptoms!);
        
        this.aiResponse.set(result.consultAiVet);
        this.toast.show('success', 'Análise concluída com sucesso!');
        this.consultForm.controls.symptoms.reset();
      } catch (error: any) {
        this.toast.show('error', 'Erro ao conectar com a IA Vet.');
      } finally {
        this.isLoadingAi.set(false);
      }
    }
  }

  async onTelegramSubmit() {
    if (this.telegramForm.valid) {
      try {
        this.isLoadingTelegram.set(true);
        const { chatId } = this.telegramForm.value;
        await this.aiVetService.linkTelegram(chatId!);
        
        this.currentChatId.set(chatId!);
        this.toast.show('success', 'Telegram vinculado com sucesso! Agora você receberá alertas.');
      } catch (error: any) {
        this.toast.show('error', 'Erro ao vincular conta do Telegram.');
      } finally {
        this.isLoadingTelegram.set(false);
      }
    }
  }
}